import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const email = request.cookies.get("email")?.value;
  const userRole = request.cookies.get("ROLE")?.value;

  // Check if the current path is one of the admin-only paths
  const restrictedPaths = ["/employees", "/attendance-list", "/attendance/*"];
  const pathname = request.nextUrl.pathname;

  if (!email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (restrictedPaths.some((path) => pathname.startsWith(path))) {
    // Check if the user has admin role
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  }

  // If all checks pass, continue with the request
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/employees", "/attendance-list", "/attendance/:path*"],
};
