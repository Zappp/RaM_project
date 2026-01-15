import { SupabaseClient } from "@supabase/supabase-js";

export interface ContextUser {
  accessToken: string;
}

interface AppVariables {
  supabase: SupabaseClient;
  user: ContextUser | null;
  [key: string]: unknown;
}

export interface AppEnv {
  Variables: AppVariables;
}
