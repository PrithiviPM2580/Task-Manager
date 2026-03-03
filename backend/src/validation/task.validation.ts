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

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
