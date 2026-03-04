import { Router } from "express";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import {
  authenticateMiddleware,
  authorizeMiddleware,
} from "@/middlewares/authenticate.middleware.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { validateRequest } from "@/middlewares/validate-request.middleware.js";
import {
  createTaskSchema,
  getTaskByIdSchema,
  getTasksQuerySchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "@/validation/task.validation.js";
import {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
  updateTaskStatusController,
  updateTaskCheckListController,
  getDashboardDataController,
  getTaskByIdController,
  getUserDashboardDataController,
} from "@/controllers/task.controller.js";

const taskRouter: Router = Router();

// @route   GET /api/tasks/dashboard-data
// @desc    Get dashboard data for the authenticated user, including task counts and recent activity
// @access  Private (Requires authentication)
taskRouter
  .route("/dashboard-data")
  .get(
    apiLimitter,
    authenticateMiddleware,
    asyncHandler(getDashboardDataController),
  );

// @route   GET /api/tasks/user-dashboard-data
// @desc    Get dashboard data for a specific user, including task counts and recent activity (Admin only)
// @access  Private (Requires authentication)
taskRouter
  .route("/user-dashboard-data")
  .get(
    apiLimitter,
    authenticateMiddleware,
    asyncHandler(getUserDashboardDataController),
  );

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user with optional filtering and pagination
// @access  Private (Requires authentication)
taskRouter
  .route("/")
  .get(
    apiLimitter,
    authenticateMiddleware,
    validateRequest({ query: getTasksQuerySchema }),
    asyncHandler(getTasksController),
  );

// @route   GET /api/tasks/:id
// @desc    Get task by ID for the authenticated user
// @access  Private (Requires authentication)
taskRouter
  .route("/:id")
  .get(
    apiLimitter,
    authenticateMiddleware,
    validateRequest({ params: getTaskByIdSchema }),
    asyncHandler(getTaskByIdController),
  );

// @route   POST /api/tasks
// @desc    Create a new task for the authenticated user
// @access  Private (Requires authentication and admin role)
taskRouter
  .route("/")
  .post(
    apiLimitter,
    authenticateMiddleware,
    authorizeMiddleware(["admin"]),
    validateRequest({ body: createTaskSchema }),
    asyncHandler(createTaskController),
  );

// @route   PUT /api/tasks/:id
// @desc    Update task by ID for the authenticated user
// @access  Private (Requires authentication)
taskRouter
  .route("/:id")
  .put(
    apiLimitter,
    authenticateMiddleware,
    validateRequest({ params: updateTaskSchema }),
    asyncHandler(updateTaskController),
  );

// @route   DELETE /api/tasks/:id
// @desc    Delete task by ID for the authenticated user
// @access  Private (Requires authentication and admin role)
taskRouter
  .route("/:id")
  .delete(
    apiLimitter,
    authenticateMiddleware,
    authorizeMiddleware(["admin"]),
    validateRequest({ params: getTaskByIdSchema }),
    asyncHandler(deleteTaskController),
  );

// @route   PUT /api/tasks/:id/status
// @desc    Update task status by ID for the authenticated user
// @access  Private (Requires authentication)
taskRouter
  .route("/:id/status")
  .put(
    apiLimitter,
    authenticateMiddleware,
    validateRequest({ body: updateTaskStatusSchema }),
    asyncHandler(updateTaskStatusController),
  );

// @route   PUT /api/tasks/:id/todo
// @desc    Update task todo list by ID for the authenticated user
// @access  Private (Requires authentication)
taskRouter
  .route("/:id/todo")
  .put(
    apiLimitter,
    authenticateMiddleware,
    validateRequest({ body: updateTaskStatusSchema }),
    asyncHandler(updateTaskCheckListController),
  );

export default taskRouter;
