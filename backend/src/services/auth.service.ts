import type {
  LoginUserInput,
  RegisterUserInput,
  UpdateProfileInput,
} from "@/validation/auth.validation.js";
import {
  findUserByEmail,
  createUser,
  findUser,
  findUserById,
  findUserDocumentById,
  findUserByIdWithPassword,
} from "@/repositories/auth.repository.js";
import logger from "@/lib/logger.lib.js";
import APIError from "@/lib/api-error.lib.js";
import { generateToken } from "@/lib/jwt.lib.js";
import { uploadToCloudinary } from "@/lib/cloudnary.lib.js";
import { deleteFromCloudinary } from "@/utils/helper.util.js";

export const registerUserService = async (userData: RegisterUserInput) => {
  const { name, email, password, profileImageUrl, adminInviteToken } = userData;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    logger.error("Registration failed: Email already in use", {
      label: "Auth_Service",
      email,
    });
    throw new APIError(400, "Registration failed: Email already in use");
  }

  let role: Roles = "member";

  if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
    role = "admin";
  }

  const newUser = await createUser({
    name,
    email,
    password,
    role,
    ...(profileImageUrl ? { profileImageUrl } : {}),
  });

  const token = generateToken({
    userId: String(newUser._id),
    email: newUser.email,
    tokenVersion: newUser.tokenVersion,
  });

  return {
    user: newUser,
    token,
  };
};

export const loginUserService = async (userData: LoginUserInput) => {
  const { email, password } = userData;

  const user = await findUser(email);

  if (!user) {
    logger.error("Login failed: User not found", {
      label: "Auth_Service",
      email,
    });
    throw new APIError(400, "Login failed: User not found");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    logger.error("Login failed: Invalid password", {
      label: "Auth_Service",
      email,
    });
    throw new APIError(400, "Login failed: Invalid password");
  }

  const token = generateToken({
    userId: String(user._id),
    email: user.email,
    tokenVersion: user.tokenVersion,
  });

  return {
    user,
    token,
  };
};

export const logoutUserService = async (userId: string) => {
  const user = await findUserDocumentById(userId);

  if (!user) {
    logger.error("Logout failed: User not found", {
      label: "Auth_Service",
      userId,
    });
    throw new APIError(404, "Logout failed: User not found");
  }

  user.tokenVersion += 1;
  await user.save();

  return;
};

export const getUserProfileService = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    logger.error("Get user profile failed: User not found", {
      label: "Auth_Service",
      userId,
    });
    throw new APIError(404, "Get user profile failed: User not found");
  }

  return { user };
};

export const updateUserProfileService = async (
  userId: string,
  updateData: UpdateProfileInput,
  file: Express.Multer.File | undefined,
) => {
  const { name, password, email } = updateData;

  const user = await findUserByIdWithPassword(userId);
  if (!user) {
    logger.error("Update user profile failed: User not found", {
      label: "Auth_Service",
      userId,
    });
    throw new APIError(404, "Update user profile failed: User not found");
  }

  if (email && email !== user.email) {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      logger.error("Update user profile failed: Email already in use", {
        label: "Auth_Service",
        userId,
        email,
      });
      throw new APIError(
        400,
        "Update user profile failed: Email already in use",
      );
    }
    user.email = email;
  }

  const isPasswordValid = password
    ? await user.comparePassword(password)
    : true;

  if (password && !isPasswordValid) {
    logger.error("Update user profile failed: Invalid password", {
      label: "Auth_Service",
      userId,
    });
    throw new APIError(400, "Update user profile failed: Invalid password");
  }

  if (name) user.name = name;
  if (password) user.password = password;

  if (file) {
    const oldPublicId = user.profileImagePublicId;

    const { url, public_id } = await uploadToCloudinary(file.buffer, "avatars");

    user.profileImageUrl = url;
    user.profileImagePublicId = public_id;

    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }
  }

  await user.save();

  return user;
};
