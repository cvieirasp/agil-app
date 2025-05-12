import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
  "/",
  "/home",
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
    await auth.protect()
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