import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signUpFormSchema = z.object({
  name: z.string().min(6, "Name must be at least 6 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  profileImageUrl: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max image size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, WEBP allowed",
    )
    .optional(),
  adminInviteToken: z
    .union([
      z.literal(""),
      z
        .string()
        .regex(/^\d{6}$/, "Admin invite token must be exactly 6 digits"),
    ])
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
