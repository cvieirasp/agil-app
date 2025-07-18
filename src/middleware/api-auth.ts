import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function apiAuthMiddleware() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  return NextResponse.next()
} 