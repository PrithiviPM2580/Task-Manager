import type { CreateTaskInput } from "@/validation/task.validation.js";
import Task from "@/models/task.model.js";

type CreateTaskData = CreateTaskInput & { createdBy: string };

export const createTask = async (taskData: CreateTaskData) => {
  return await Task.create(taskData);
};

export const findTasks = async (filter: any = {}) => {
  return await Task.find(filter)
    .populate("assignedTo", "name email profileImageUrl")
    .lean();
};

export const allTaskCountDocument = async (role: Roles, userId: string) => {
  return await Task.countDocuments(
    role === "admin" ? {} : { assignedTo: userId },
  ).lean();
};

export const statusTaskCountDocument = async (
  filter: any = {},
  role: Roles,
  userId: string,
) => {
  return await Task.countDocuments({
    ...filter,
    ...(role !== "admin" && { assignedTo: userId }),
  });
};

export const findTaskById = async (id: string) => {
  return await Task.findById(id)
    .populate("assignedTo", "name email profileImageUrl")
    .lean();
};
