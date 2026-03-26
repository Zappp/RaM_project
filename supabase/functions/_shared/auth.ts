import { MiddlewareHandler } from "@hono/hono";
import { AppEnv } from "./types/env.ts";
import { HTTPException } from "@hono/hono/http-exception";
import { AuthError } from "@supabase";

export const WithAuth = (): MiddlewareHandler<AppEnv<"authenticated">> => {
  return async (context, next) => {
    const supabase = context.get("supabase");
    try {
      const token = context.req.header("Authorization")?.replace("Bearer ", "");
      const { data, error } = await supabase.auth.getClaims(token);

      if (!data?.claims) throw new AuthError("Unauthorized");
      if (error) throw error;

      context.set("user", { id: data.claims.sub });

      return await next();
    } catch (error) {
      throw new HTTPException(401, {
        message: error instanceof Error ? error.message : "Unauthorized",
      });
    }
  };
};
