import { MiddlewareHandler } from "hono";
import { parseCookies, setCookiesInContext } from "./cookies.ts";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env.ts";
import { AppEnv } from "./types/hono.ts";
import { ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS } from "./constants.ts";

export const supabaseMiddleware = (): MiddlewareHandler<AppEnv> => {
  return async (context, next) => {
    const { allCookies, user, tokenExpiresAt } = await parseCookies(context);

    const supabase = createServerClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return allCookies;
          },
          setAll(cookiesToSet) {
            setCookiesInContext(context, cookiesToSet);
          },
        },
        auth: { throwOnError: false },
      },
    );

    let updatedUser = user;
    if (user && tokenExpiresAt) {
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenExpiresAt - now;

      if (timeUntilExpiry < ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          updatedUser = { accessToken: session.access_token };
        }
      }
    }

    context.set("supabase", supabase as unknown as SupabaseClient);
    context.set("user", updatedUser);

    await next();
  };
};
