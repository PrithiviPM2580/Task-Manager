import type { Request, Response } from "express";
import logger from "@/lib/logger.lib.js";
import { createTaskService } from "@/services/task.service.js";
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
