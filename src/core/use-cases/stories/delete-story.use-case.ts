import { AuthService } from '../../domain/interfaces/auth.service';
import { StoryRepository } from '../../domain/interfaces/story.repository';

export class DeleteStoryUseCase {
  constructor(
    private readonly storyRepository: StoryRepository,
    private readonly authService: AuthService
  ) {}

  async execute(storyId: string): Promise<void> {
    try {
      const isAuthenticated = await this.authService.isAuthenticated();
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const userId = await this.authService.getUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }

      // First verify the story belongs to the user
      const story = await this.storyRepository.findById(storyId);
      if (!story) {
        throw new Error('Story not found');
      }

      if (story.clerk_user_id !== userId) {
        throw new Error('Unauthorized to delete this story');
      }

      // Delete the story
      await this.storyRepository.delete(storyId);
    } catch (error) {
      throw error;
    }
  }
}
