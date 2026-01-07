import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = !!authCookie?.value;

  const protectedRoutes = ["/dashboard", "/favorites"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthenticated && (pathname === "/" || pathname.startsWith("/auth"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
