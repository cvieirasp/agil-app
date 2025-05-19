import { SupabaseClient } from '@supabase/supabase-js';

// Generic database client type
export type DatabaseClient = SupabaseClient;

// Generic connection options
export interface ConnectionOptions {
  token: string;
}

// Main database service interface
export interface DatabaseService {
  connect(options: ConnectionOptions): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getClient(): DatabaseClient;
}
