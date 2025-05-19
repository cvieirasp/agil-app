export interface AuthService {
  getToken(): Promise<string>;
  isAuthenticated(): Promise<boolean>;
  getUserId(): Promise<string | null>;
}
