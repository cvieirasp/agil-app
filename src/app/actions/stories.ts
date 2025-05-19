'use server'

import { ClerkAuthService } from '@/infrastructure/auth/clerk/clerk-auth.service'
import { SupabaseService } from '@/infrastructure/database/supabase.service'

// Set up Supabase real-time channel for client-side use
export async function setupRealtimeChannel() {
  try {
    // Get auth token
    const authService = new ClerkAuthService()
    const token = await authService.getToken()

    // Connect to Supabase
    const supabaseService = new SupabaseService()
    await supabaseService.connect({ token })
    
    // Return info needed for client to establish its own subscription
    return {
      success: true,
      authToken: supabaseService.getClient().auth.getSession(), // This will be used by client
      channelName: 'story_changes'
    }
  } catch (error) {
    console.error('Error setting up real-time channel:', error)
    return {
      success: false,
      error: 'Failed to set up real-time channel'
    }
  }
}
