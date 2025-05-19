import { Story } from '../entities/story.entity';

export interface StoryRepository {
  findById(id: string): Promise<Story | null>;
  findAll(): Promise<Story[]>;
  delete(id: string): Promise<void>;
}
