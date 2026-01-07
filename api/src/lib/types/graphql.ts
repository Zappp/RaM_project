import type { Context } from "hono";
import { User } from "./auth.ts";

export interface GraphQLContext {
  context: Context;
  user: User | null;
}
