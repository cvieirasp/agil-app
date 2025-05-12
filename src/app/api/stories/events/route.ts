import { supabaseServer } from "@/lib/supabase-server"
import { errorHandler, handleSupabaseError } from "@/middleware/error-handler"

export async function GET(request: Request) {
  try {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Send initial connection message
        controller.enqueue(encoder.encode("data: connected\n\n"))

        const channel = supabaseServer
          .channel('story_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'story_info'
            },
            (payload: unknown) => {
              console.log('Received change:', payload)
              const data = `data: ${JSON.stringify(payload)}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          )
          .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to story changes')
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Subscription error:', err)
              handleSupabaseError(new Error('Failed to subscribe to story changes'))
            } else {
              console.log('Subscription status:', status)
            }
          })

        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          console.log('Client disconnected, cleaning up subscription')
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
    console.error('Stream error:', error)
    return errorHandler(error)
  }
} 