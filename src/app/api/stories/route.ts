import { NextResponse } from 'next/server';
import { ClerkAuthService } from '@/infrastructure/auth/clerk/clerk-auth.service';
import { SupabaseService } from '@/infrastructure/database/supabase.service';
import { SupabaseStoryRepository } from '@/infrastructure/repositories/supabase-story.repository';
import { GetStoriesUseCase } from '@/core/use-cases/stories/get-stories.use-case';

export async function GET() {
  try {
    const authService = new ClerkAuthService();
    const databaseService = new SupabaseService();
    
    // Get auth token and connect to database
    const token = await authService.getToken();
    await databaseService.connect({ token });

    // Create repository and use case
    const storyRepository = new SupabaseStoryRepository(databaseService.getClient());
    const getStoriesUseCase = new GetStoriesUseCase(storyRepository, authService);

    // Execute use case to get stories
    const stories = await getStoriesUseCase.execute();

    // Return the stories as JSON
    return NextResponse.json({
      count: stories.length,
      stories
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}
