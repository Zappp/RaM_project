import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { createGraphQLServer } from "@/lib/graphql.ts";
import { env } from "@/lib/env.ts";
import { supabase } from "@/lib/supabase.ts";
import { setCookie } from "@/lib/cookies.ts";

const app = new Hono();

const yoga = createGraphQLServer();

app.use(
  "*",
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.get("/auth/callback", async (context) => {
  const code = context.req.query("code");
  const error = context.req.query("error");
  const redirectTo = env.FRONTEND_URL;

  if (error) {
    console.error("Auth callback error:", error);
    return context.redirect(`${redirectTo}/auth/error?message=${encodeURIComponent("Authentication failed")}`);
  }

  if (!code) {
    return context.redirect(`${redirectTo}/auth/error?message=${encodeURIComponent("Missing verification code")}`);
  }

  try {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Code exchange error:", exchangeError.message);
      return context.redirect(`${redirectTo}/auth/error?message=${encodeURIComponent("Verification failed")}`);
    }

    if (!data.session) {
      console.error("No session returned from code exchange");
      return context.redirect(`${redirectTo}/auth/error?message=${encodeURIComponent("Verification failed")}`);
    }

    console.info(`User email verified: ${data.user?.id}`);

    const authCookie = setCookie("auth-token", data.session.access_token);
    const redirectResponse = context.redirect(`${redirectTo}/auth/verify?success=true`);
    redirectResponse.headers.set("Set-Cookie", authCookie);

    return redirectResponse;
  } catch (error) {
    console.error("Callback error:", error);
    return context.redirect(`${redirectTo}/auth/error?message=${encodeURIComponent("Verification failed")}`);
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
