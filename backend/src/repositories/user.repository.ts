import Task from "@/models/task.model.js";
import User from "@/models/user.model.js";

export const findAllUsersByRole = async () => {
  return await User.find({ role: "member" })
    .select("-password -tokenVersion")
    .lean();
};

export const getDocumentTasksCount = async (userId: string) => {
  const [pendingTaskCount, inProgressTaskCount, completedTaskCount] =
    await Promise.all([
      Task.countDocuments({
        assignedTo: userId,
        status: "Pending",
      }).lean(),
      Task.countDocuments({
        assignedTo: userId,
        status: "In Progress",
      }).lean(),
      Task.countDocuments({
        assignedTo: userId,
        status: "Completed",
      }).lean(),
    ]);

  return {
    pending: pendingTaskCount,
    inProgress: inProgressTaskCount,
    completed: completedTaskCount,
  };
};
