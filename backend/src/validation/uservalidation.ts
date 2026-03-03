import { z } from "zod";
import { Types } from "mongoose";

export const getUserByIdSchema = z.object({
  id: z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid user ID format",
  }),
});

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
