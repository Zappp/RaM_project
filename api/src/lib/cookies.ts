import { parseCookieHeader } from "@supabase/ssr";
import { decodeBase64Url } from "@std/encoding/base64url";
import type { Context } from "hono";
import type { CookieToSet } from "./types/cookie.ts";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { env } from "./env.ts";
import { User } from "./types/auth.ts";
import type { TokenVerificationResult } from "./types/cookie.ts";

export async function parseCookies(context: Context): Promise<{
  allCookies: Array<CookieToSet>;
  user: User | null;
  tokenExpiresAt: number | null;
}> {
  const cookieHeader = context.req.header("Cookie") ?? "";
  const parsed = parseCookieHeader(cookieHeader);
  const authCookie = parsed.find((cookie) =>
    cookie.name.includes("auth-token")
  );

  let verifiedAccessToken: string | null = null;
  let tokenExpiresAt: number | null = null;

  if (authCookie?.value) {
    const accessToken = extractAccessTokenFromAuthCookieValue(authCookie.value);
    if (accessToken) {
      const verificationResult = await verifyAccessToken(accessToken);
      if (verificationResult) {
        verifiedAccessToken = verificationResult.token;
        tokenExpiresAt = verificationResult.expiresAt;
      }
    }
  }

  const allCookies: Array<CookieToSet> = [];
  const isProduction = Deno.env.get("NODE_ENV") === "production";

  for (const cookie of parsed) {
    const isAccessTokenInvalid =
      cookie.name.includes("auth-token") && !verifiedAccessToken;

    if (isAccessTokenInvalid) {
      allCookies.push({
        name: cookie.name,
        value: "",
        options: {
          maxAge: 0,
          path: "/",
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
        },
      });
    } else {
      allCookies.push({
        name: cookie.name,
        value: cookie.value ?? "",
      });
    }
  }

  const user = verifiedAccessToken
    ? { accessToken: verifiedAccessToken }
    : null;

  return { allCookies, user, tokenExpiresAt };
}

function extractAccessTokenFromAuthCookieValue(
  cookieValue: string
): string | null {
  const trimmed = cookieValue.trim();
  if (!trimmed.startsWith("base64-")) {
    return null;
  }

  const payload = trimmed.slice("base64-".length);
  try {
    const decodedBytes = decodeBase64Url(payload);
    const decodedJson = new TextDecoder().decode(decodedBytes);
    const parsed = JSON.parse(decodedJson);
    return typeof parsed?.access_token === "string"
      ? parsed.access_token
      : null;
  } catch {
    return null;
  }
}

export async function verifyAccessToken(
  token: string
): Promise<TokenVerificationResult | null> {
  try {
    const jwks = createRemoteJWKSet(
      new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
    );

    const { payload } = await jwtVerify(token, jwks, {
      algorithms: ["RS256", "ES256"],
    });

    const expiresAt = typeof payload.exp === "number" ? payload.exp : null;

    return {
      token,
      expiresAt,
    };
  } catch {
    return null;
  }
}

export function setCookiesInContext(
  context: Context,
  cookiesToSet: Array<CookieToSet>
): void {
  cookiesToSet.forEach(({ name, value, options }) => {
    const cookieParts: string[] = [`${name}=${encodeURIComponent(value)}`];

    if (options) {
      if (options.path) {
        cookieParts.push(`Path=${options.path}`);
      }
      if (options.maxAge !== undefined) {
        cookieParts.push(`Max-Age=${options.maxAge}`);
      }
      if (options.domain) {
        cookieParts.push(`Domain=${options.domain}`);
      }
      if (options.sameSite) {
        const sameSiteValue =
          typeof options.sameSite === "string"
            ? options.sameSite.charAt(0).toUpperCase() +
              options.sameSite.slice(1).toLowerCase()
            : "Lax";
        cookieParts.push(`SameSite=${sameSiteValue}`);
      }
      if (options.secure) {
        cookieParts.push("Secure");
      }
      if (options.httpOnly) {
        cookieParts.push("HttpOnly");
      }
      if (options.expires) {
        cookieParts.push(`Expires=${options.expires.toUTCString()}`);
      }
    }

    const cookieHeader = cookieParts.join("; ");
    context.res.headers.append("Set-Cookie", cookieHeader);
  });
}

export function mergeSetCookieHeadersFromHonoToYogaResponse(
  context: Context,
  yogaResponse: Response
): Response {
  const setCookieHeaders = context.res.headers.getSetCookie();

  if (setCookieHeaders.length === 0) {
    return yogaResponse;
  }

  const responseHeaders = new Headers(yogaResponse.headers);
  setCookieHeaders.forEach((cookieHeader) => {
    responseHeaders.append("Set-Cookie", cookieHeader);
  });

  return new Response(yogaResponse.body, {
    status: yogaResponse.status,
    statusText: yogaResponse.statusText,
    headers: responseHeaders,
  });
}
