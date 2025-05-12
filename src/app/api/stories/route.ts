import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { errorHandler, handleSupabaseError } from "@/middleware/error-handler"
import type { Story, SupabaseResponse } from "@/types/supabase"

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('story_info')
      .select('*')
      .order('created_at', { ascending: false }) as SupabaseResponse<Story[]>

    if (error) {
      handleSupabaseError(error)
    }

    return NextResponse.json(data)
  } catch (error) {
    return errorHandler(error)
  }
} 