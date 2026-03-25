import { SupabaseClient } from "@supabase";
import { Database } from "./database.types.ts";
import { Env } from "@hono/hono";

interface ContextUser {
  id: string;
}

interface AppVariables {
  supabase: SupabaseClient<Database>;
  supabaseAdmin: SupabaseClient<Database>;
}

type AuthState = "authenticated" | "unauthenticated";

export type AppEnv<T extends AuthState = "unauthenticated"> = T extends
  "authenticated" ? Env & { Variables: AppVariables & { user: ContextUser } }
  : Env & { Variables: AppVariables };
