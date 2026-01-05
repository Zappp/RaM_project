import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { supabase } from "@/lib/supabase.ts";
import { createGraphQLServer } from "@/lib/graphql.ts";
import { env } from "@/lib/env.ts";

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

app.get("/auth/callback", async (context) => {
  const token = context.req.query("token");
  const type = context.req.query("type");
  const redirectTo = env.FRONTEND_URL;

  if (!token) {
    return context.redirect(`${redirectTo}/auth/error?message=Missing verification token`);
  }

  try {
    if (type === "signup" || type === "email") {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      });

      if (error || !data.session || !data.user) {
        console.error("Email verification error:", error?.message);
        return context.redirect(`${redirectTo}/auth/error?message=${encodeURIComponent(error?.message || "Verification failed")}`);
      }

      console.info(`User email verified: ${data.user.id}`);

      return context.redirect(`${redirectTo}/auth/verify?token=${data.session.access_token}`);
    }

    return context.redirect(`${redirectTo}/auth/error?message=Invalid verification type`);
  } catch (error) {
    console.error("Callback error:", error);
    return context.redirect(`${redirectTo}/auth/error?message=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`);
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
    port: env.PORT,
    onListen: ({ port }) => {
      console.log(`Server running on port ${port}`);
    },
  },
  app.fetch
);
