"use server";

import { redirect } from "next/navigation";
import { serverGraphqlRequest } from "../graphql/graphqlRequest";
import {
  SignupDocument,
  LoginDocument,
  LogoutDocument,
} from "../types/generated";
import type { SignupMutation, LoginMutation } from "../types/generated";

export interface AuthActionResult {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email?: string | null;
    emailVerified: boolean;
  };
}

export async function signupAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const data = await serverGraphqlRequest<SignupMutation>(
      SignupDocument,
      {
        email,
        password,
      }
    );

    if (!data.signup.emailVerified) {
      return { message: "Please check your email to verify your account" };
    } else {
      return { message: "Email address already verified" };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Signup failed";
    return { error: errorMessage };
  }
}

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await serverGraphqlRequest<LoginMutation>(LoginDocument, {
      email,
      password,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Login failed";
    return { error: errorMessage };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await serverGraphqlRequest(LogoutDocument);
  redirect("/");
}
