import { Story } from '../../domain/entities/story.entity';
import { AuthService } from '../../domain/interfaces/auth.service';
import { StoryRepository } from '../../domain/interfaces/story.repository';

export class GetStoriesUseCase {
  constructor(
    private readonly storyRepository: StoryRepository,
    private readonly authService: AuthService
  ) {}

  async execute(): Promise<Story[]> {
    try {
      const isAuthenticated = await this.authService.isAuthenticated();
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      return await this.storyRepository.findAll();
    } catch (error) {
      throw error;
    }
  }
}
