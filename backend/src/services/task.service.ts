import type {
  CreateTaskInput,
  GetTasksQueryInput,
} from "@/validation/task.validation.js";
import {
  createTask,
  findTasks,
  allTaskCountDocument,
  statusTaskCountDocument,
} from "@/repositories/task.repository.js";

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
