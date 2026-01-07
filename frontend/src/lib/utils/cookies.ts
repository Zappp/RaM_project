import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "../constants";

export function handleSetCookieHeaders(setCookieHeaders: string[]): void {
  const cookieStore = cookies();

  if (setCookieHeaders.length > 0) {
    for (const cookieHeader of setCookieHeaders) {
      const cookieMatch = cookieHeader.match(/^([^=]+)=([^;]*)/);
      if (cookieMatch && cookieMatch[1] === AUTH_COOKIE_NAME) {
        const cookieValue = cookieMatch[2];
        const maxAgeMatch = cookieHeader.match(/Max-Age=(\d+)/);
        const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : null;

        if (maxAge === 0 || cookieValue === "") {
          cookieStore.delete(AUTH_COOKIE_NAME);
        } else {
          const pathMatch = cookieHeader.match(/Path=([^;]+)/);
          const path = pathMatch ? pathMatch[1] : "/";
          const secure = cookieHeader.includes("Secure");
          const httpOnly = cookieHeader.includes("HttpOnly");
          const sameSiteMatch = cookieHeader.match(/SameSite=([^;]+)/);
          const sameSite = (sameSiteMatch
            ? sameSiteMatch[1].toLowerCase()
            : "lax") as "lax" | "strict" | "none";

          cookieStore.set(AUTH_COOKIE_NAME, cookieValue, {
            httpOnly,
            secure: secure || process.env.NODE_ENV === "production",
            sameSite,
            maxAge: maxAge || 60 * 60 * 24 * 7,
            path,
          });
        }
      }
    }
  }
}

