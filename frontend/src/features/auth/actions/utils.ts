import "server-only";

import { AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function requireActionAuth() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) {
    throw new AuthError(
      error?.message || "Unauthorized",
      error?.status ?? 401,
      error?.code ?? "no_authorization",
    );
  }
}
