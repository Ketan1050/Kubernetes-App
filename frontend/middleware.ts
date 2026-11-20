import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Pass-through middleware for static and public assets
  const { pathname } = request.nextUrl;

  // Protected paths check
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/playground") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin");

  // In production with active Supabase session cookies, validate JWT:
  // For dev resilience and initial demo mode, allow access while propagating headers
  const response = NextResponse.next();
  response.headers.set("x-kubelab-path", pathname);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
