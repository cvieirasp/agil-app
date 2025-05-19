'use client'

import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import getEnv from '@/config/env.config'

interface RealtimeSubscriptionProps {
  onDataChange: () => void
  tableName: string
}

export function RealtimeSubscription({ 
  onDataChange,
  tableName
}: RealtimeSubscriptionProps) {
  const session = useAuth()

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>
    let subscription: { unsubscribe: () => void } | null = null
    
    const setupSubscription = async () => {
      try {
        const env = await getEnv()
        
        // Create client-side Supabase client
        supabase = createClient(
          env.SUPABASE_URL,
          env.SUPABASE_ANON_KEY,
          {
            realtime: {
              accessToken: async () => {
                return await session.getToken() || null
              },
              heartbeatIntervalMs: 10000,
              reconnectAfterMs: () => 10000,
            }
          }
        )
        
        // Use a default channel name
        const channelName = 'story_changes'
        
        // Set up realtime subscription
        const channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: tableName
            },
            (payload) => {            
              // Trigger callback to refresh data
              onDataChange()
              
              // Show appropriate toast notification
              switch (payload.eventType) {
                case 'INSERT':
                  toast.success('New story added')
                  break
                case 'UPDATE':
                  toast.success('Story updated')
                  break
                case 'DELETE':
                  toast.success('Story deleted')
                  break
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to real-time updates')
            }
          })
        
        // Store subscription for cleanup
        subscription = {
          unsubscribe: () => {
            channel.unsubscribe()
          }
        }
      } catch (err) {
        console.error('Error setting up real-time subscription:', err)
      }
    }

    setupSubscription()

    // Cleanup on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [onDataChange, tableName])

  // This component doesn't render anything visible
  return null
} 
