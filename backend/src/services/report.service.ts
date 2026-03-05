import excelJs from "exceljs";
import { findTasks, findUsers } from "@/repositories/report.repository.js";
import type { Response } from "express";

type UserTaskSummary = {
  name: string;
  email: string;
  taskCount: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
};

export const exportTasksReportService = async (res: Response) => {
  const tasks = await findTasks();

  const workbook = new excelJs.Workbook();
  const worksheet = workbook.addWorksheet("Tasks Report");

  worksheet.columns = [
    { header: "Task ID", key: "_id", width: 25 },
    { header: "Title", key: "title", width: 30 },
    { header: "Description", key: "description", width: 50 },
    { header: "Priority", key: "priority", width: 15 },
    { header: "Status", key: "status", width: 20 },
    { header: "Due Date", key: "dueDate", width: 20 },
    { header: "Assigned To", key: "assignedTo", width: 30 },
  ];

  tasks.forEach((task) => {
    const assignedTo = task.assignedTo
      .map((user) => `${user.name} (${user.email})`)
      .join(", ");
    worksheet.addRow({
      _id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate.toISOString().split("T")[0],
      assignedTo: assignedTo || "Unassigned",
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=tasks_report.xlsx",
  );

  return await workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

export const exportUsersReportService = async (res: Response) => {
  const { users, usersTasks } = await findUsers();

  const userTaskMap: Record<string, UserTaskSummary> = {};

  users.forEach((user) => {
    userTaskMap[String(user._id)] = {
      name: user.name,
      email: user.email,
      taskCount: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
    };
  });

  usersTasks.forEach((task) => {
    if (task.assignedTo) {
      task.assignedTo.forEach((user) => {
        const summary = userTaskMap[String(user._id)];

        if (summary) {
          summary.taskCount += 1;
          if (task.status === "Pending") {
            summary.pendingTasks += 1;
          } else if (task.status === "In Progress") {
            summary.inProgressTasks += 1;
          } else if (task.status === "Completed") {
            summary.completedTasks += 1;
          }
        }
      });
    }
  });

  const workbook = new excelJs.Workbook();
  const worksheet = workbook.addWorksheet("Users Report");

  worksheet.columns = [
    { header: "Name", key: "name", width: 30 },
    { header: "Email", key: "email", width: 40 },
    { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
    { header: "Pending Tasks", key: "pendingTasks", width: 20 },
    { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
    { header: "Completed Tasks", key: "completedTasks", width: 20 },
  ];

  Object.values(userTaskMap).forEach((summary) => {
    worksheet.addRow(summary);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=users_report.xlsx",
  );

  return await workbook.xlsx.write(res).then(() => {
    res.end();
  });
};
