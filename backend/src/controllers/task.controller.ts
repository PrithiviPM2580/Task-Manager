import type { Request, Response } from "express";
import logger from "@/lib/logger.lib.js";
import { createTaskService, getTasksService } from "@/services/task.service.js";
import type { GetTasksQueryInput } from "@/validation/task.validation.js";
import { successResponse } from "@/utils/success-response.util.js";

export const createTaskController = async (req: Request, res: Response) => {
  const { task } = await createTaskService(req.body, req.user!.userId);

  logger.info("Task created successfully", {
    label: "Task_Controller",
    taskId: task._id,
  });

  successResponse(res, 201, "Task created successfully", {
    task,
  });
};

export const getTasksController = async (req: Request, res: Response) => {
  const { tasks, statusSummary } = await getTasksService(
    req.user!,
    req.query as GetTasksQueryInput,
  );

  logger.info("Fetched tasks successfully", {
    label: "Task_Controller",
    taskCount: tasks.length,
  });

  successResponse(res, 200, "Tasks fetched successfully", {
    tasks,
    statusSummary,
  });
};
