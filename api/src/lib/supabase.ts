import { createClient } from "@supabase/supabase-js";
import { env } from "./env.ts";
import type { GraphQLContext } from "./types/graphql.ts";
import { getCookie } from "./cookies.ts";
import { AUTH_COOKIE_NAME } from "./constants.ts";
import { AuthenticationError } from "./errors.ts";

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: { flowType: "pkce" },
});

export function createAuthenticatedSupabaseClient(context: GraphQLContext) {
  if (!context.user) {
    throw new AuthenticationError();
  }

  const cookieHeader = context.context.req.header("Cookie") || null;
  const token = getCookie(cookieHeader, AUTH_COOKIE_NAME);

  if (!token) {
    throw new AuthenticationError();
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
