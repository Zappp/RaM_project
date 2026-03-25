import { z } from "zod";

export const signupSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});
