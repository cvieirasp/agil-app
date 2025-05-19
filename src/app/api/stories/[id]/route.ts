import { NextRequest, NextResponse } from 'next/server';
import { DeleteStoryUseCase } from '@/core/use-cases/stories/delete-story.use-case';
import { ClerkAuthService } from '@/infrastructure/auth/clerk/clerk-auth.service';
import { SupabaseService } from '@/infrastructure/database/supabase.service';
import { SupabaseStoryRepository } from '@/infrastructure/repositories/supabase-story.repository';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authService = new ClerkAuthService();
    const databaseService = new SupabaseService();

    // Get the token and connect to database
    const token = await authService.getToken();
    await databaseService.connect({ token });

    // Create repository and use case
    const storyRepository = new SupabaseStoryRepository(databaseService.getClient());
    const deleteStoryUseCase = new DeleteStoryUseCase(storyRepository, authService);

    // Execute use case to delete the story
    const { id } = await params;
    await deleteStoryUseCase.execute(id);
    
    return NextResponse.json(
      { message: 'Story deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting story:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Story not found') {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      if (error.message === 'Unauthorized to delete this story') {
        return NextResponse.json(
          { error: 'Unauthorized to delete this story' },
          { status: 403 }
        );
      }
      if (error.message === 'User is not authenticated') {
        return NextResponse.json(
          { error: 'User is not authenticated' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    );
  }
} 