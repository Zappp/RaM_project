import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

// TODO update sharable logic (as well json ?)

export function createSupabaseClient(req: Request): {
  supabase: SupabaseClient;
  accessToken?: string;
} {
  const authHeader = req.headers.get("Authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : undefined;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken
        ? {
          Authorization: `Bearer ${accessToken}`,
        }
        : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return { supabase, accessToken };
}
