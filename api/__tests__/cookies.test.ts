import { assertEquals } from "@std/assert";
import { setCookie, getCookie, clearCookie } from "@/lib/cookies.ts";

Deno.test("setCookie - creates cookie string with default options", () => {
  const cookie = setCookie("token", "abc123");
  assertEquals(cookie.includes("token=abc123"), true);
  assertEquals(cookie.includes("HttpOnly"), true);
  assertEquals(cookie.includes("Secure"), true);
  assertEquals(cookie.includes("SameSite=Lax"), true);
  assertEquals(cookie.includes("Max-Age="), true);
  assertEquals(cookie.includes("Path=/"), true);
});

Deno.test("setCookie - respects custom options", () => {
  const cookie = setCookie("token", "abc123", {
    httpOnly: false,
    secure: false,
    sameSite: "None",
    maxAge: 3600,
    path: "/api",
  });

  assertEquals(cookie.includes("token=abc123"), true);
  assertEquals(cookie.includes("HttpOnly"), false);
  assertEquals(cookie.includes("Secure"), false);
  assertEquals(cookie.includes("SameSite=None"), true);
  assertEquals(cookie.includes("Max-Age=3600"), true);
  assertEquals(cookie.includes("Path=/api"), true);
});

Deno.test("getCookie - extracts cookie value", () => {
  const cookieHeader = "token=abc123; other=value; another=test";
  const value = getCookie(cookieHeader, "token");
  assertEquals(value, "abc123");
});

Deno.test("getCookie - returns null for missing cookie", () => {
  const cookieHeader = "other=value; another=test";
  const value = getCookie(cookieHeader, "token");
  assertEquals(value, null);
});

Deno.test("getCookie - returns null for null header", () => {
  const value = getCookie(null, "token");
  assertEquals(value, null);
});

Deno.test("clearCookie - creates cookie clearing string", () => {
  const cookie = clearCookie("token");
  assertEquals(cookie.includes("token="), true);
  assertEquals(cookie.includes("Max-Age=0"), true);
  assertEquals(cookie.includes("Path=/"), true);
  assertEquals(cookie.includes("HttpOnly"), true);
  assertEquals(cookie.includes("Secure"), true);
});

