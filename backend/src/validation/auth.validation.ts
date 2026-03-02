import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(6, "Name must be at least 6 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  profileImageUrl: z.string().optional(),
  adminInviteToken: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
