export interface Story {
  id: string
  story_code: string
  application_scope: string
  definition_of_ready: string
  definition_of_done: string
  acceptance_criteria: string
  created_at: string
}

export interface SupabaseError {
  message: string
  details?: string
  hint?: string
  code?: string
}

export interface SupabaseResponse<T> {
  data: T | null
  error: SupabaseError | null
}

export interface RealtimePayload<T> {
  schema: string
  table: string
  commit_timestamp: string
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
  errors: null | SupabaseError[]
}

export interface PostgresChangesConfig {
  event: '*' | 'INSERT' | 'UPDATE' | 'DELETE'
  schema: string
  table: string
  filter?: string
}

export type SupabaseChannelEvent = 'postgres_changes' | 'system' | 'broadcast' 