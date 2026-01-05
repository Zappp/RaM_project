import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { supabase } from "@/lib/supabase.ts";
import { createGraphQLServer } from "@/lib/graphql.ts";

const app = new Hono();

const yoga = createGraphQLServer();

app.use(
  "*",
  cors({
    origin: "*", // TODO: Configure proper origins in production
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (context) => {
  return context.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/health/supabase", async (context) => {
  try {
    await supabase.auth.getSession();

    return context.json({
      status: "ok",
      message: "Successfully connected to Supabase",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Supabase connection test failed:", error);
    return context.json(
      {
        status: "error",
        message: "Supabase connection test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

app.all("/graphql", async (context) => {
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
  return context.json({ error: "Not found" }, 404);
});

app.onError((err, context) => {
  console.error("Error:", err);
  return context.json({ error: "Internal server error" }, 500);
});

Deno.serve(
  {
    port: parseInt(Deno.env.get("PORT") || "8000"),
    onListen: ({ port }) => {
      console.log(`Server running on port ${port}`);
    },
  },
  app.fetch
);
