import type { Request, Response } from "express";
import { registerUserService } from "@/services/auth.service.js";
import logger from "@/lib/logger.lib.js";
import { successResponse } from "@/utils/success-response.js";

export const registerUserController = async (req: Request, res: Response) => {
  const { user, token } = await registerUserService(req.body);

  logger.info("User registered successfully", {
    label: "Auth_Controller",
    userId: user._id,
    email: user.email,
  });

  successResponse(res, 201, "User registered successfully", {
    user,
    token,
  });
};

export const loginUserController = (req: Request, res: Response) => {};

export const logoutUserController = (req: Request, res: Response) => {};

export const getUserProfileController = (req: Request, res: Response) => {};

export const updateUserProfileController = (req: Request, res: Response) => {};
