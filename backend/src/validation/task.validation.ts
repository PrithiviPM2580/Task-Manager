import { z } from "zod";
import { Types } from "mongoose";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string("Description must be a string"),
  assignedTo: z
    .array(
      z.string().refine(Types.ObjectId.isValid, {
        message: "Invalid assigned user ID",
      }),
    )
    .min(1, "At least one user must be assigned to the task"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  dueDate: z.coerce.date(),
  attachments: z.array(z.string()).default([]),
  todoCheckList: z.array(
    z.object({
      text: z.string().min(1, "Todo item text is required"),
      completed: z.boolean().default(false),
    }),
  ),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string("Description must be a string").optional(),
  assignedTo: z
    .array(
      z.string().refine(Types.ObjectId.isValid, {
        message: "Invalid assigned user ID",
      }),
    )
    .min(1, "At least one user must be assigned to the task")
    .optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  status: z.enum(["Pending", "In Progress", "Completed"]).optional(),
  dueDate: z.coerce.date().optional(),
  attachments: z.array(z.string()).optional(),
  todoCheckList: z
    .array(
      z.object({
        text: z.string().min(1, "Todo item text is required"),
        completed: z.boolean().default(false),
      }),
    )
    .optional(),
});

export const getTasksQuerySchema = z.object({
  status: z.enum(["Pending", "In Progress", "Completed"]).optional(),
});

export const getTaskByIdSchema = z.object({
  id: z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid task ID",
  }),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["Pending", "In Progress", "Completed"]),
});

export type GetTaskByIdInput = z.infer<typeof getTaskByIdSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type GetTasksQueryInput = z.infer<typeof getTasksQuerySchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
