import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { createGraphQLServer } from "../../../src/lib/graphql.ts";
import { env } from "../../../src/lib/env.ts";

const app = new Hono();

const yoga = createGraphQLServer();

app.use(
  "*",
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

app.all("*", async (context) => {
  const url = new URL(context.req.url);
  url.pathname = "/graphql";

  const request = new Request(url.toString(), {
    method: context.req.method,
    headers: context.req.header(),
    body: context.req.method !== "GET" && context.req.method !== "HEAD"
      ? await context.req.raw.clone().arrayBuffer()
      : undefined,
  });

  (request as Request & { honoContext: Context }).honoContext = context;

  const response = await yoga.fetch(request);

  return response;
});

app.notFound((context) => {
  return context.json(
    {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Not found",
      },
    },
    404,
  );
});

app.onError((err, context) => {
  console.error("Error:", err);
  return context.json(
    {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    },
    500,
  );
});

Deno.serve((req: Request) => {
  return app.fetch(req);
});
