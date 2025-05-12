import { supabaseServer } from "@/lib/supabase-server"
import { errorHandler, handleSupabaseError } from "@/middleware/error-handler"
import type { Story, RealtimePayload } from "@/types/supabase"

export async function GET(request: Request) {
  try {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const channel = supabaseServer
          .channel('story_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'story_info'
            },
            (payload: RealtimePayload<Story>) => {
              const data = `data: ${JSON.stringify(payload)}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Subscribed to story changes')
            } else if (status === 'CHANNEL_ERROR') {
              handleSupabaseError(new Error('Failed to subscribe to story changes'))
            }
          })

        request.signal.addEventListener('abort', () => {
          channel.unsubscribe()
          controller.close()
        })
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    return errorHandler(error)
  }
} 