import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isClerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

const isProtectedRoute = createRouteMatcher([
  "/dashboard/:path*",
  "/dashboard",
  "/workspace/:path*",
]);

const middleware = isClerkConfigured
  ? clerkMiddleware(
      async (auth, req) => {
        if (isProtectedRoute(req)) {
          await auth.protect();
        }
      },
      {
        frontendApiProxy: {
          enabled: true,
        },
      }
    )
  : () => NextResponse.next();

export default middleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|woff|woff2|ico|csv|docx|xlsx|zip|webmanifest)).*)",
    "/__clerk/(.*)",
    "/(api|trpc)(.*)",
  ],
};