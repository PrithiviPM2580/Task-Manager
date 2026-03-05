import {
  exportTasksReportController,
  exportUsersReportController,
} from "@/controllers/report.controller.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import {
  authenticateMiddleware,
  authorizeMiddleware,
} from "@/middlewares/authenticate.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import { Router } from "express";

const reportRouter: Router = Router();

// @route   GET /api/reports/export/tasks
// @desc    Export all tasks to a CSV file for the authenticated user
// @access  Private (Requires authentication and admin role)
reportRouter
  .route("/export/tasks")
  .get(
    apiLimitter,
    authenticateMiddleware,
    authorizeMiddleware(["admin"]),
    asyncHandler(exportTasksReportController),
  );

// @route   GET /api/reports/export/users
// @desc    Export all users to a CSV file for the authenticated user
// @access  Private (Requires authentication and admin role)
reportRouter
  .route("/export/users")
  .get(
    apiLimitter,
    authenticateMiddleware,
    authorizeMiddleware(["admin"]),
    asyncHandler(exportUsersReportController),
  );

export default reportRouter;
