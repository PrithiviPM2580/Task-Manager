import Task from "@/models/task.model.js";
import User from "@/models/user.model.js";

export const findTasks = async () => {
  return await Task.find().populate<{
    assignedTo: { name: string; email: string }[];
  }>("assignedTo", "name email");
};

export const findUsers = async () => {
  const [users, usersTasks] = await Promise.all([
    User.find().select("name email _id"),
    Task.find().populate<{
      assignedTo: { name: string; email: string; _id: string }[];
    }>("assignedTo", "name email _id"),
  ]);

  return {
    users,
    usersTasks,
  };
};
