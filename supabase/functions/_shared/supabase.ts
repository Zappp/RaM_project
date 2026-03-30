import { createClient } from "@supabase";
import { MiddlewareHandler } from "@hono/hono";
import { AppEnv } from "./types/env.ts";
import { env } from "./hono.ts";

export const WithSupabase = (): MiddlewareHandler<AppEnv> => {
  return async (context, next) => {
    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: context.req.header("Authorization") ?? "" },
        },
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false,
        },
      },
    );

    const supabaseAdmin = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
    );

    context.set("supabase", supabase);
    context.set("supabaseAdmin", supabaseAdmin);
    return await next();
  };
};
