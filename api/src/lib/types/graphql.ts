import type { Context } from "hono";
import type { User } from "@supabase/supabase-js";

export interface GraphQLContext {
  context: Context;
  user: Pick<User, "id" | "email"> | null;
}

