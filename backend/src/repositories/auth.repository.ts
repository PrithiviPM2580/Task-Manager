import User from "@/models/user.model.js";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({
    email,
  }).lean();
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  profileImageUrl?: string;
  role: Roles;
}) => {
  return await User.create(userData);
};
