export interface AuthSchema {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken?: string;
  refreshToken?: string;
}
