import type { CreateTaskInput } from "@/validation/task.validation.js";
import Task from "@/models/task.model.js";

type CreateTaskData = CreateTaskInput & { createdBy: string };

export const createTask = async (taskData: CreateTaskData) => {
  return await Task.create(taskData);
};
