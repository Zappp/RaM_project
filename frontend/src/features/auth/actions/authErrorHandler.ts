"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function handleAuthError(
  error: unknown,
  shouldRedirect: boolean = false
): Promise<boolean> {
  const errorCode = (error as any)?.code;
  const errorMessage = error instanceof Error ? error.message : "";

  if (errorCode === "UNAUTHENTICATED" || errorMessage === "Authentication required") {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    
    if (shouldRedirect) {
      redirect("/");
    }
    
    return true;
  }
  
  return false;
}

