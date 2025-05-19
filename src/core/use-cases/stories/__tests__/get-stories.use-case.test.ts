import { GetStoriesUseCase } from '../get-stories.use-case';
import { AuthService } from '@/core/domain/interfaces/auth.service';
import { StoryRepository } from '@/core/domain/interfaces/story.repository';
import { Story } from '@/core/domain/entities/story.entity';

describe('GetStoriesUseCase', () => {
  let useCase: GetStoriesUseCase;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockStoryRepository: jest.Mocked<StoryRepository>;

  const mockStories: Story[] = [
    {
      id: '1',
      story_code: 'STORY-1',
      application_scope: 'Test Scope 1',
      definition_of_ready: 'Test DOR 1',
      definition_of_done: 'Test DOD 1',
      acceptance_criteria: 'Test AC 1',
      created_at: new Date().toISOString(),
      clerk_user_id: 'user-1',
    },
    {
      id: '2',
      story_code: 'STORY-2',
      application_scope: 'Test Scope 2',
      definition_of_ready: 'Test DOR 2',
      definition_of_done: 'Test DOD 2',
      acceptance_criteria: 'Test AC 2',
      created_at: new Date().toISOString(),
      clerk_user_id: 'user-1',
    },
  ];

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: jest.fn(),
      getUserId: jest.fn(),
      getToken: jest.fn(),
    };

    mockStoryRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetStoriesUseCase(mockStoryRepository, mockAuthService);
  });

  it('should return stories when user is authenticated', async () => {
    // Arrange
    mockAuthService.isAuthenticated.mockResolvedValue(true);
    mockStoryRepository.findAll.mockResolvedValue(mockStories);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual(mockStories);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockStoryRepository.findAll).toHaveBeenCalled();
  });

  it('should throw error when user is not authenticated', async () => {
    // Arrange
    mockAuthService.isAuthenticated.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow('User is not authenticated');
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockStoryRepository.findAll).not.toHaveBeenCalled();
  });

  it('should return empty array when no stories exist', async () => {
    // Arrange
    mockAuthService.isAuthenticated.mockResolvedValue(true);
    mockStoryRepository.findAll.mockResolvedValue([]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockStoryRepository.findAll).toHaveBeenCalled();
  });

  it('should throw error when repository fails', async () => {
    // Arrange
    mockAuthService.isAuthenticated.mockResolvedValue(true);
    mockStoryRepository.findAll.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow('Database error');
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockStoryRepository.findAll).toHaveBeenCalled();
  });
});
