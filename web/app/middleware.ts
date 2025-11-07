import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Redirect non-logged-in users to /signin, except for /signin, /signup, and /reset-password
  if (!token && !["/signin", "/signup", "/reset-password"].includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Redirect logged-in users away from /signin and /signup
  if (token && ["/signin", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|public|favicon.ico).*)"],
};
