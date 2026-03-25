import { cors } from "@hono/hono/cors";
import { AppEnv } from "./types/env.ts";
import { Hono } from "@hono/hono";
import { WithSupabase } from "./supabase.ts";
import { getEnv } from "./utils.ts";

export const env = getEnv();

const app = new Hono<AppEnv>();

app.use(
  "*",
  cors({
    origin: [env.FRONTEND_URL],
    allowHeaders: ["authorization", "x-client-info", "apikey", "content-type"],
    allowMethods: [
      "POST",
      "GET",
      "DELETE",
      "OPTIONS",
    ],
    credentials: true,
    maxAge: 600,
  }),
  WithSupabase(),
);

export default app;
