import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  
  return NextResponse.redirect(new URL("/", request.url));
}

