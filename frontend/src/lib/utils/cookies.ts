import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "../constants";

export function setAuthCookie(token: string): void {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function clearAuthCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

