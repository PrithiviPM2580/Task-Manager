import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  profileImageUrl: z.string().optional(),
  adminInviteToken: z.string().optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
