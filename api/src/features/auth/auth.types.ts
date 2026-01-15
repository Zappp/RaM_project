import type { z } from "zod";
import type { loginSchema, signupSchema } from "./auth.validationSchema.ts";

export interface AuthUser {
  id: string;
  email: string;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface SignupResponse {
  user: AuthUser | null;
  message: string | null;
}

export type ValidatedLogin = z.infer<typeof loginSchema>;
export type ValidatedSignup = z.infer<typeof signupSchema>;
