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

export const findTaskDocumentById = async (id: string) => {
  return await Task.findById(id);
};

export const taskStatsDocument = async () => {
  const [totalTasks, pendingTasks, completedTasks, overdueTasks] =
    await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: "Pending" }),
      Task.countDocuments({ status: "Completed" }),
      Task.countDocuments({
        status: { $ne: "Completed" },
        dueDate: { $lt: new Date() },
      }),
    ]);

  return {
    total: totalTasks,
    pending: pendingTasks,
    completed: completedTasks,
    overdue: overdueTasks,
  };
};

export const taskDistribution = async () => {
  return await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
};

export const taskStatusDistribution = async (userId: string) => {
  return await Task.aggregate([
    { $match: { assignedTo: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
};

export const taskPriorityDistribution = async () => {
  return await Task.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);
};

export const taskPriorityLevelsDistribution = async (userId: string) => {
  return await Task.aggregate([
    { $match: { assignedTo: userId } },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);
};

export const findRecentTasks = async () => {
  return await Task.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt")
    .lean();
};

export const findRecentUserTasks = async (userId: string) => {
  return await Task.find({ assignedTo: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt")
    .lean();
};

export const userSpacificTaskStatsDocument = async (userId: string) => {
  const [totalTasks, pendingTasks, completedTasks, overdueTasks] =
    await Promise.all([
      Task.countDocuments({ assignedTo: userId }),
      Task.countDocuments({ assignedTo: userId, status: "Pending" }),
      Task.countDocuments({ assignedTo: userId, status: "Completed" }),
      Task.countDocuments({
        assignedTo: userId,
        status: { $ne: "Completed" },
        dueDate: { $lt: new Date() },
      }),
    ]);

  return {
    total: totalTasks,
    pending: pendingTasks,
    completed: completedTasks,
    overdue: overdueTasks,
  };
};
