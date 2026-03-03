import type { Request, Response } from "express";
import logger from "@/lib/logger.lib.js";
import {
  createTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  updateTaskStatusService,
  updateTaskCheckListService
} from "@/services/task.service.js";
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

export const getTaskByIdController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const { task } = await getTaskByIdService(id);

  logger.info("Fetched task by ID successfully", {
    label: "Task_Controller",
    taskId: id,
  });

  successResponse(res, 200, "Task fetched successfully", {
    task,
  });
};

export const updateTaskController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  await updateTaskService(id, req.body);

  logger.info("Task updated successfully", {
    label: "Task_Controller",
    taskId: id,
  });

  successResponse(res, 200, "Task updated successfully");
};

export const deleteTaskController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  // Call the service to delete the task
  await deleteTaskService(id);

  logger.info("Task deleted successfully", {
    label: "Task_Controller",
    taskId: id,
  });

  successResponse(res, 200, "Task deleted successfully");
};

export const updateTaskStatusController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params as { id: string };

  await updateTaskStatusService(id, req.body, req.user!.role);

  logger.info("Task status updated successfully", {
    label: "Task_Controller",
    taskId: id,
  });

  successResponse(res, 200, "Task status updated successfully");
};


export const updateTaskCheckListController = async (req: Request, res: Response) => {

    const { id } = req.params as { id: string };

  await updateTaskCheckListService(id, req.body, req.user!);

    logger.info("Task checklist updated successfully", {
        label: "Task_Controller",
        taskId: id,
    });

    successResponse(res, 200, "Task checklist updated successfully");
}