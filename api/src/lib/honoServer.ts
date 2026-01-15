import { Hono } from "hono";
import { cors } from "hono/cors";
import { GraphQLError } from "graphql";
import { NotFoundError, InternalServerError } from "./errors.ts";
import { env } from "./env.ts";
import { mergeSetCookieHeadersFromHonoToYogaResponse } from "./cookies.ts";
import { createGraphQLServer } from "./graphql.ts";
import { supabaseMiddleware } from "./supabase.ts";
import { AppEnv } from "./types/hono.ts";

export function createHonoServer() {
  const app = new Hono<AppEnv>();
  const yoga = createGraphQLServer();

  app.use(
    "*",
    cors({
      origin: [env.FRONTEND_URL],
      credentials: true,
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Cookie"],
    }),
    supabaseMiddleware()
  );

  // TODO check if can split into two separate handlers
  app.all("*", async (context) => {
    const url = new URL(context.req.url);
    url.pathname = "/graphql";
    const request = new Request(url.toString(), {
      method: context.req.method,
      headers: context.req.header(),
      body:
        context.req.method !== "GET" && context.req.method !== "HEAD"
          ? await context.req.raw.clone().arrayBuffer()
          : undefined,
    });
    (request as Request & { yogaContext: AppEnv["Variables"] }).yogaContext =
      context.var;

    const response = await yoga.fetch(request);

    return mergeSetCookieHeadersFromHonoToYogaResponse(context, response);
  });

  app.notFound((context) => {
    const error = new NotFoundError();
    return context.json(
      {
        errors: [
          {
            message: error.message,
            extensions: {
              code: error.extensions?.code,
              statusCode: error.extensions?.statusCode,
            },
          },
        ],
      },
      404
    );
  });

  app.onError((err, context) => {
    let error: GraphQLError;
    if (err instanceof GraphQLError) {
      error = err;
    } else {
      error = new InternalServerError(
        err instanceof Error ? err.message : "Internal server error"
      );
    }

    return context.json(
      {
        errors: [
          {
            message: error.message,
            extensions: {
              code: error.extensions?.code,
              statusCode: error.extensions?.statusCode,
            },
          },
        ],
      },
      (error.extensions?.statusCode as number) || 500
    );
  });

  return app;
}
