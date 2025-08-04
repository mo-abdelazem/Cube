import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default createMiddleware(routing);

const intlMiddleware = createMiddleware(routing);
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle admin routes
  if (pathname.includes("/admin")) {
    console.log("Admin route accessed:", pathname);

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("Token in middleware:", {
      hasToken: !!token,
      role: token?.role,
      email: token?.email,
    });

    // If no token, redirect to login
    if (!token) {
      console.log("No token found, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has ADMIN role (exact match for your Prisma enum)
    if (token.role !== "ADMIN") {
      console.log("User role is not ADMIN:", token.role, "redirecting home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("ADMIN access granted in middleware");
  }

  // Handle internationalization for all other routes
  return intlMiddleware(request);
}
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
