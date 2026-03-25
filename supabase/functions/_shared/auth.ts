import { HonoRequest, MiddlewareHandler } from "@hono/hono";
import { AppEnv } from "./types/env.ts";
import * as jose from "@jose";
import { env } from "./hono.ts";

const SUPABASE_JWT_KEYS = jose.createRemoteJWKSet(
  new URL(env.SUPABASE_URL + "/auth/v1/.well-known/jwks.json"),
);

function getAuthToken(req: HonoRequest) {
  const authHeader = req.header("authorization");
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer") {
    throw new Error(`Authorization header is not 'Bearer {token}'`);
  }
  return token;
}

function verifySupabaseJWT(jwt: string) {
  return jose.jwtVerify(jwt, SUPABASE_JWT_KEYS, {
    issuer: env.JWT_ISSUER,
  });
}

export const WithAuth = (): MiddlewareHandler<AppEnv<"authenticated">> => {
  return async (context, next) => {
    try {
      const token = getAuthToken(context.req);
      const isValidJWT = await verifySupabaseJWT(token);

      if (isValidJWT) {
        const { sub } = jose.decodeJwt(token);
        context.set("user", { id: sub! });
        return await next();
      }

      return context.json({ error: "Invalid JWT" }, 401);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Unauthorized";
      return context.json({ error: errorMessage }, 401);
    }
  };
};
