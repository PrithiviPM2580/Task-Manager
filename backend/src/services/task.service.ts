import logger from "@/lib/logger.lib.js";
import APIError from "@/lib/api-error.lib.js";
import type { CreateTaskInput } from "@/validation/task.validation.js";
import { createTask } from "@/repositories/task.repository.js";

export const createTaskService = async (
  taskData: CreateTaskInput,
  userId: string,
) => {
  const task = await createTask({ ...taskData, createdBy: userId });

  return { task };
};
