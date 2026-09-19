import { z } from "zod";

import { emailSchema, passwordSchema } from "./auth-schemas";

export const profileInfoSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: emailSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  });

export type ProfileInfoInput = z.infer<typeof profileInfoSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
