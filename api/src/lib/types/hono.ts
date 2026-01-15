import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "./auth.ts";

interface AppVariables {
  supabase: SupabaseClient;
  user: User | null;
  [key: string]: unknown;
}

export interface AppEnv {
  Variables: AppVariables;
}
