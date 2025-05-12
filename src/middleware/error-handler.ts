import { NextResponse } from "next/server"
import type { SupabaseError } from "@/types/supabase"

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(error: unknown) {
  console.error('Error:', error)

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}

export function handleSupabaseError(error: SupabaseError) {
  throw new AppError(
    error.message,
    400,
    {
      details: error.details,
      hint: error.hint,
      code: error.code
    }
  )
} 