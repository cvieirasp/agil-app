import { auth } from '@clerk/nextjs/server';
import { AuthService } from '@/core/domain/interfaces/auth.service';

export class ClerkAuthService implements AuthService {
  async getToken(): Promise<string> {
    const session = await auth();
    const token = await session.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    return token;
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await auth();
    return !!session.userId;
  }

  async getUserId(): Promise<string | null> {
    const session = await auth();
    return session.userId;
  }
}
