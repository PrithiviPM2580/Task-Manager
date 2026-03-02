import type { RegisterUserInput } from "@/validation/auth.validation.js";
import { findUserByEmail, createUser } from "@/repositories/auth.repository.js";
import logger from "@/lib/logger.lib.js";
import APIError from "@/lib/api-error.lib.js";
import { generateToken } from "@/lib/jwt.lib.js";

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
