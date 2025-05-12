import { RealtimeChannel } from '@supabase/supabase-js'

declare module '@supabase/supabase-js' {
  interface RealtimeChannel {
    on(
      event: 'postgres_changes',
      filter: {
        event: '*' | 'INSERT' | 'UPDATE' | 'DELETE'
        schema: string
        table: string
        filter?: string
      },
      callback: (payload: any) => void
    ): this
  }
} 