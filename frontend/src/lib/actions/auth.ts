"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase";
import { signupSchema, loginSchema } from "../validations/auth";
import { z } from "zod";
import type { ActionResult } from "../types/actions";

export async function signupAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validationResult = signupSchema.safeParse({ email, password });
  if (!validationResult.success) {
    const prettified = z.prettifyError(validationResult.error);
    return { error: prettified };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: validationResult.data.email,
      password: validationResult.data.password,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"
        }/auth/verify-email?next=/dashboard`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.user) {
      return { error: "Failed to create user" };
    }

    if (data.user.email_confirmed_at && data.session) {
      redirect("/dashboard");
    }

    return { success: true, message: "Please check your email to verify your account" };
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    return { error: error instanceof Error ? error.message : "Signup failed" };
  }
}

export async function loginAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validationResult = loginSchema.safeParse({ email, password });
  if (!validationResult.success) {
    const prettified = z.prettifyError(validationResult.error);
    return { error: prettified };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validationResult.data.email,
      password: validationResult.data.password,
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.session || !data.user) {
      return { error: "Failed to authenticate" };
    }

    redirect("/dashboard");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    return { error: error instanceof Error ? error.message : "Login failed" };
  }
}

export async function logoutAction() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error signing out from Supabase:", error);
  }

  redirect("/");
}

