import {
  DatabaseService as IDatabaseService,
  ConnectionOptions,
  DatabaseClient
} from '@/core/domain/interfaces/database.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import getEnv from '@/config/env.config';

/**
 * Database service implementation using Supabase
 */
export class SupabaseService implements IDatabaseService {
  private client: SupabaseClient | null = null;

  constructor() {}

  /**
   * Get the database client
   * @returns The Supabase client
   */
  getClient(): DatabaseClient {
    if (!this.client) {
      throw new Error('Database client not initialized. Call connect() first.');
    }
    return this.client;
  }

  /**
   * Connect to the database
   * @param options Connection options containing the auth token
   */
  async connect(options: ConnectionOptions): Promise<void> {
    try {
      const env = await getEnv();
      
      this.client = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY,
        {
          accessToken: async () => options.token,
          auth: {
            persistSession: false
          }
        }
      );
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    this.client = null;
  }

  /**
   * Check if connected to the database
   * @returns True if connected, false otherwise
   */
  isConnected(): boolean {
    return this.client?.auth.getSession() !== null;
  }
}
