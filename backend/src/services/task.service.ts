import type {
  CreateTaskInput,
  GetTasksQueryInput,
  UpdateTaskInput,
} from "@/validation/task.validation.js";
import {
  createTask,
  findTasks,
  allTaskCountDocument,
  statusTaskCountDocument,
  findTaskById,
  findTaskDocumentById,
} from "@/repositories/task.repository.js";
import logger from "@/lib/logger.lib.js";
import APIError from "@/lib/api-error.lib.js";
import { Types } from "mongoose";
import type { ITodo } from "@/models/task.model.js";

export const createTaskService = async (
  taskData: CreateTaskInput,
  userId: string,
) => {
  const task = await createTask({ ...taskData, createdBy: userId });

  return { task };
};

export const getTasksService = async (
  user: { userId: string; role: Roles },
  query: GetTasksQueryInput,
) => {
  const { status } = query;

  const baseFilter: { status?: GetTasksQueryInput["status"] } = {};

  if (status) {
    baseFilter.status = status;
  }

  const listFilter =
    user.role === "admin"
      ? baseFilter
      : { ...baseFilter, assignedTo: user.userId };

  const tasks = await findTasks(listFilter);

  const tasksWithCompletedTodoCount = tasks.map((task) => {
    const completedCount = task.todoCheckList.filter(
      (item) => item.completed,
    ).length;
    return { ...task, completedTodoCount: completedCount };
  });

  const [allTasks, pendingTasks, inProgressTasks, completedTasks] =
    await Promise.all([
      allTaskCountDocument(user.role, user.userId),
      statusTaskCountDocument(
        { ...baseFilter, status: "Pending" },
        user.role,
        user.userId,
      ),
      statusTaskCountDocument(
        { ...baseFilter, status: "In Progress" },
        user.role,
        user.userId,
      ),
      statusTaskCountDocument(
        { ...baseFilter, status: "Completed" },
        user.role,
        user.userId,
      ),
    ]);

  return {
    tasks: tasksWithCompletedTodoCount,
    statusSummary: {
      all: allTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
      completed: completedTasks,
    },
  };
};

export const getTaskByIdService = async (id: string) => {
  const task = await findTaskById(id);

  if (!task) {
    logger.error("Task not found", {
      label: "Task_Service",
      taskId: id,
    });
    throw new APIError(404, "Task not found");
  }

  return { task };
};

export const updateTaskService = async (
  id: string,
  updateData: UpdateTaskInput,
) => {
  const {
    title,
    description,
    assignedTo,
    priority,
    status,
    dueDate,
    attachments,
    todoCheckList,
  } = updateData;

  const task = await findTaskDocumentById(id);

  if (!task) {
    logger.error("Task not found for update", {
      label: "Task_Service",
      taskId: id,
    });
    throw new APIError(404, "Task not found for update");
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (assignedTo !== undefined) {
    task.assignedTo = assignedTo.map((id) => new Types.ObjectId(id));
  }
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (attachments !== undefined) task.attachments = attachments;
  if (todoCheckList !== undefined) task.todoCheckList = todoCheckList;

  await task.save();

  return;
};

export const deleteTaskService = async (id: string) => {
  const task = await findTaskDocumentById(id);

  if (!task) {
    logger.error("Task not found for deletion", {
      label: "Task_Service",
      taskId: id,
    });
    throw new APIError(404, "Task not found for deletion");
  }

  await task.deleteOne();

  return;
};

export const updateTaskStatusService = async (
  id: string,
  updateData: { status: Status },
  role: Roles,
) => {
  const { status } = updateData;

  const task = await findTaskDocumentById(id);

  if (!task) {
    logger.error("Task not found for status update", {
      label: "Task_Service",
      taskId: id,
    });
    throw new APIError(404, "Task not found for status update");
  }

  const isAssigned = task.assignedTo.some((userId) => userId.toString() === id);

  if (!isAssigned && role !== "admin") {
    logger.error("Unauthorized to update task status", {
      label: "Task_Service",
      taskId: id,
    });
    throw new APIError(403, "Unauthorized to update task status");
  }

  task.status = status;

  if (status === "Completed") {
    task.todoCheckList.forEach((item) => (item.completed = true));
    task.progress = 100;
  }

  await task.save();

  return;
};

export const updateTaskCheckListService = async (
  id: string,
  updateData: { todoCheckList: ITodo[] },
  user: { userId: string; role: Roles },
) => {
  const { todoCheckList } = updateData;

  const task = await findTaskDocumentById(id);

  if (!task) {
    logger.error("Task not found for checklist update", {
      label: "Task_Service",
      taskId: id,
    });
    throw new APIError(404, "Task not found for checklist update");
  }

  const isAssigned = task.assignedTo.some(
    (assignedUserId) => assignedUserId.toString() === user.userId,
  );

  if (!isAssigned && user.role !== "admin") {
    logger.error("Unauthorized to update task checklist", {
      label: "Task_Service",
      taskId: id,
    });
    throw new APIError(403, "Unauthorized to update task checklist");
  }

  task.todoCheckList = todoCheckList;
  task.progress =
    todoCheckList.length === 0
      ? 0
      : Math.round(
          (todoCheckList.filter((item) => item.completed).length /
            todoCheckList.length) *
            100,
        );

  if (task.progress === 100) {
    task.status = "Completed";
  } else if (task.status === "Completed") {
    task.status = "In Progress";
  }

  await task.save();

  return;
};
