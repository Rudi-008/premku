import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isAdminRoute =
    pathname.startsWith("/admin");

  const isProtectedRoute =
    isAdminRoute; // sekarang hanya admin yang protected

  // =========================
  // SIMPLE TOKEN VALIDATION
  // =========================
  const isValidToken = !!token && token.length > 20;

  // =========================
  // PROTECT ADMIN ROUTE
  // =========================
  if (isProtectedRoute && !isValidToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // =========================
  // PREVENT LOGIN IF ALREADY AUTHENTICATED
  // =========================
  if (isAuthPage && isValidToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/products"; // default user landing after login
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * =========================
 * GLOBAL MATCHER
 * =========================
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};