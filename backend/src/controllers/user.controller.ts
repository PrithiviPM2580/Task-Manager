import logger from "@/lib/logger.lib.js";
import {
  getAllUsersService,
  getUserByIdService,
  deleteUserByIdService,
} from "@/services/user.service.js";
import { successResponse } from "@/utils/success-response.util.js";
import type { Request, Response } from "express";

export const getAllUsersController = async (_req: Request, res: Response) => {
  const { users } = await getAllUsersService();

  logger.info("Fetched all users with task counts", {
    label: "User_Controller",
    userCount: users.length,
  });

  successResponse(res, 200, "Users fetched successfully", {
    users,
  });
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { user } = await getUserByIdService(id);

  logger.info("Fetched user by ID", {
    label: "User_Controller",
    userId: id,
  });

  successResponse(res, 200, "User fetched successfully", {
    user,
  });
};

export const deleteUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await deleteUserByIdService(id);

  logger.info("Deleted user by ID", {
    label: "User_Controller",
    userId: id,
  });

  successResponse(res, 200, "User deleted successfully");
};
