import type { Context } from "hono";
import type { SupabaseClient } from "@supabase/supabase-js";
import { User } from "./auth.ts";

export interface GraphQLContext {
  context: Context;
  user: User | null;
  supabase: SupabaseClient;
}
