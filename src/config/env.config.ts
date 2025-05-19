'use server'

import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define environment schema
const envSchema = z.object({
// Application Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase Configuration
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  
  // N8N Webhook Configuration
  N8N_WEBHOOK_URL: z.string().url('Invalid N8N Webhook URL'),
  N8N_WEBHOOK_KEY: z.string().min(1, 'N8N Webhook key is required'),
});

// Parse environment variables with safe parsing
const result = envSchema.safeParse(process.env);

// Throw an error if the environment variables are not valid
if (!result.success || !result.data) {
    throw new Error(result.error?.issues?.map(issue => issue.message).join('\n') || 'Environment configuration error');
}

console.log(`✅ Environment configured for ${result.data.NODE_ENV} mode`);

export default async function getEnv() {
  return Promise.resolve(result.data!);
}
