export interface AuthSchema {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken?: string;
  refreshToken?: string;
  userId?: number | null;
  username?: string;
}
