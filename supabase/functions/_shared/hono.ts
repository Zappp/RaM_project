import { cors } from "@hono/hono/cors";
import { AppEnv } from "./types/env.ts";
import { Hono } from "@hono/hono";
import { WithSupabase } from "./supabase.ts";
import { getEnv } from "./utils.ts";
import { logger } from "@hono/hono/logger";

export const env = getEnv();
const corsOptions = {
  origin: "*",
  allowHeaders: ["authorization", "x-client-info", "apikey", "content-type"],
  allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  maxAge: 600,
};

const app = new Hono<AppEnv>();

app.use("*", logger(), cors(corsOptions), WithSupabase());

export default app;
