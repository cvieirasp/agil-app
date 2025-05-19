import { SupabaseClient } from '@supabase/supabase-js';
import { Story } from '@/core/domain/entities/story.entity';
import { StoryRepository } from '@/core/domain/interfaces/story.repository';
import { DatabaseClient, DatabaseService } from '@/core/domain/interfaces/database.service';

export class SupabaseStoryRepository implements StoryRepository {

  constructor(private readonly client: DatabaseClient) { }

  async findById(id: string): Promise<Story | null> {
    const { data, error } = await this.client
      .from('story_info')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Story;
  }

  async findAll(): Promise<Story[]> {
    const { data, error } = await this.client
      .from('story_info')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as Story[];
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from('story_info')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
