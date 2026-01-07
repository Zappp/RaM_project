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

  if (error) {
    console.error("Auth callback error:", error);
    const redirectUrl = `${
      env.FRONTEND_URL
    }/auth/error?error=${encodeURIComponent(error)}`;
    return context.redirect(redirectUrl, 302);
  }

  if (!code) {
    const redirectUrl = `${env.FRONTEND_URL}/auth/error?error=${encodeURIComponent("Missing verification code")}`;
    return context.redirect(redirectUrl, 302);
  }

  try {
    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Code exchange error:", exchangeError.message);
      const redirectUrl = `${env.FRONTEND_URL}/auth/error?error=${encodeURIComponent("Verification failed")}`;
      return context.redirect(redirectUrl, 302);
    }

    if (!data.session) {
      console.error("No session returned from code exchange");
      const redirectUrl = `${env.FRONTEND_URL}/auth/error?error=${encodeURIComponent("Verification failed")}`;
      return context.redirect(redirectUrl, 302);
    }

    console.info(`User email verified: ${data.user?.id}`);

    const cookieValue = setCookie("auth-token", data.session.access_token);
    const redirectUrl = `${env.FRONTEND_URL}`; // TODO later redirect to a specific page

    const response = context.redirect(redirectUrl, 302);
    response.headers.set("Set-Cookie", cookieValue);
    return response;
  } catch (error) {
    console.error("Callback error:", error);
    const errorMessage = error instanceof Error ? error.message : "Verification failed";
    const redirectUrl = `${env.FRONTEND_URL}/auth/error?error=${encodeURIComponent(errorMessage)}`;
    return context.redirect(redirectUrl, 302);
  }
});

app.all("/graphql", async (context) => {
  const url = new URL(context.req.url);
  url.pathname = "/graphql";

  const setCookieHeaders: string[] = [];
  const originalHeader = context.header.bind(context);
  context.header = ((name: string, value?: string) => {
    if (name === "Set-Cookie" && value !== undefined) {
      setCookieHeaders.push(value);
    }
    return originalHeader(name, value);
  }) as typeof context.header;

  const request = new Request(url.toString(), {
    method: context.req.method,
    headers: context.req.header(),
    body:
      context.req.method !== "GET" && context.req.method !== "HEAD"
        ? await context.req.raw.clone().arrayBuffer()
        : undefined,
  });

  (request as Request & { honoContext: Context }).honoContext = context;

  const response = await yoga.fetch(request);

  if (setCookieHeaders.length > 0) {
    const responseHeaders = new Headers(response.headers);
    setCookieHeaders.forEach((cookie) => {
      responseHeaders.append("Set-Cookie", cookie);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  }

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
    404
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
    500
  );
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
