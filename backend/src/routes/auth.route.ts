import {
  registerUserController,
  loginUserController,
  getUserProfileController,
  updateUserProfileController,
  logoutUserController,
} from "@/controllers/auth.controller.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { authenticateMiddleware } from "@/middlewares/authenticate.middleware.js";
import {
  apiLimitter,
  authLimitter,
} from "@/middlewares/rate-limiter.middleware.js";
import { validateRequest } from "@/middlewares/validate-request.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateProfileSchema,
} from "@/validation/auth.validation.js";
import { Router } from "express";

const authRouter: Router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
authRouter
  .route("/register")
  .post(
    authLimitter,
    validateRequest({ body: registerUserSchema }),
    asyncHandler(registerUserController),
  );

// @route   POST /api/auth/login
// @desc    Authenticate user and return token
// @access  Public
authRouter
  .route("/login")
  .post(
    authLimitter,
    validateRequest({ body: loginUserSchema }),
    asyncHandler(loginUserController),
  );

// @route   POST /api/auth/logout
// @desc    Logout user and invalidate token
// @access  Private
authRouter
  .route("/logout")
  .post(
    authLimitter,
    authenticateMiddleware,
    asyncHandler(logoutUserController),
  );

// @route   POST /api/auth/profile
// @desc    Get user profile
// @access  Private (Requires authentication)
authRouter
  .route("/profile")
  .get(
    authLimitter,
    authenticateMiddleware,
    asyncHandler(getUserProfileController),
  );

// @route   POST /api/auth/profile/update
// @desc    Update user profile
// @access  Private (Requires authentication)
authRouter
  .route("/profile")
  .put(
    apiLimitter,
    authenticateMiddleware,
    validateRequest({ body: updateProfileSchema }),
    asyncHandler(updateUserProfileController),
  );

export default authRouter;
