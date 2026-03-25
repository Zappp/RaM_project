"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation.js";
import { handleActionError } from "@/lib/error";
import { createClient } from "@/lib/supabase/server";
import type { AsyncActionResult } from "@/lib/types/actions";
import { signInSchema, signupSchema } from "./validationSchema.ts";

export async function signupAction(
  _prevState: unknown,
  formData: FormData,
): Promise<AsyncActionResult<string, typeof signupSchema>> {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  try {
    const { email, password } = await signupSchema.parseAsync(
      Object.fromEntries(formData.entries()),
    );
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/verify-email`,
      },
    });

    if (error) throw error;

    return { data: "Check your email for the verification link.", error: null, success: true };
  } catch (error) {
    return await handleActionError(error, "Signup failed");
  }
}

export async function signInAction(
  _prevState: unknown,
  formData: FormData,
): Promise<AsyncActionResult<null, typeof signInSchema>> {
  const supabase = await createClient();
  try {
    const { email, password } = await signInSchema.parseAsync(
      Object.fromEntries(formData.entries()),
    );
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    redirect("/dashboard");
  } catch (error) {
    return await handleActionError(error, "Signin failed");
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  const cookieStore = await cookies();

  await supabase.auth.signOut().catch(() => {});
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.includes("auth-token")) {
      cookieStore.delete(cookie.name);
    }
  }
  redirect("/");
}
