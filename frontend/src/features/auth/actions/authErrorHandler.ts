"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { AuthError } from "@/lib/errors/AuthError";

export async function handleAuthError(
  error: unknown,
  shouldRedirect: boolean = true
): Promise<never | boolean> {
  if (!(error instanceof AuthError)) {
    return false;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  
  if (shouldRedirect) {
    redirect("/");
  }
  
  return true;
}

