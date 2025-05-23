import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher([
  "/",
  "/home",
  "/agil-definitions",
  "/agil-definitions/(.*)",
  "/stories",
  "/stories/(.*)"
])

const isAdminRoute = createRouteMatcher([
  "/agil-definitions",
  "/agil-definitions/(.*)",
  "/stories",
  "/stories/(.*)"
])

const isAuthRoute = createRouteMatcher([
  "/login(.*)",
  "/signup(.*)"
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const protectedRoute = await auth.protect()
    if (isAdminRoute(req) && protectedRoute.sessionClaims.internal_role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }
  if (isAuthRoute(req)) {
    return
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ],
} 