import type { Request, Response } from "express";
import {
  registerUserService,
  loginUserService,
  getUserProfileService,
  updateUserProfileService,
  logoutUserService,
} from "@/services/auth.service.js";
import logger from "@/lib/logger.lib.js";
import { successResponse } from "@/utils/success-response.js";
import cookie from "@/lib/cookie.lib.js";

export const registerUserController = async (req: Request, res: Response) => {
  const { user, token } = await registerUserService(req.body);

  cookie.set(res, "token", token);

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

export const loginUserController = async (req: Request, res: Response) => {
  const { user, token } = await loginUserService(req.body);

  cookie.set(res, "token", token);

  logger.info("User logged in successfully", {
    label: "Auth_Controller",
    userId: user._id,
    email: user.email,
  });

  successResponse(res, 200, "User logged in successfully", {
    user,
    token,
  });
};

export const logoutUserController = async (req: Request, res: Response) => {
  await logoutUserService(req.user!.userId);

  cookie.clear(res, "token");

  logger.info("User logged out successfully", {
    label: "Auth_Controller",
    userId: req.user!.userId,
  });

  successResponse(res, 200, "User logged out successfully");
};

export const getUserProfileController = async (req: Request, res: Response) => {
  const { user } = await getUserProfileService(req.user!.userId);

  logger.info("User profile retrieved successfully", {
    label: "Auth_Controller",
    userId: user._id,
    email: user.email,
  });

  successResponse(res, 200, "User profile retrieved successfully", {
    user,
  });
};

export const updateUserProfileController = async (
  req: Request,
  res: Response,
) => {
  await updateUserProfileService(req.user!.userId, req.body);

  logger.info("User profile updated successfully", {
    label: "Auth_Controller",
    userId: req.user!.userId,
  });

  successResponse(res, 200, "User profile updated successfully");
};
