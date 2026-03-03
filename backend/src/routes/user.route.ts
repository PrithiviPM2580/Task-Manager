import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
} from "@/controllers/user.controller.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import {
  authenticateMiddleware,
  authorizeMiddleware,
} from "@/middlewares/authenticate.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import { validateRequest } from "@/middlewares/validate-request.middleware.js";
import { getUserByIdSchema } from "@/validation/uservalidation.js";

const userRouter: Router = Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Requires authentication and admin role)
userRouter
  .route("/")
  .get(
    apiLimitter,
    authenticateMiddleware,
    authorizeMiddleware(["admin"]),
    asyncHandler(getAllUsersController),
  );

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Requires authentication)
userRouter
  .route("/:id")
  .get(
    apiLimitter,
    authenticateMiddleware,
    validateRequest({ params: getUserByIdSchema }),
    asyncHandler(getUserByIdController),
  );

// @route   DELETE /api/users/:id
// @desc    Delete user by ID
// @access  Private (Requires authentication and admin role)
userRouter.route("/:id").delete((_req, _res) => {});

export default userRouter;
