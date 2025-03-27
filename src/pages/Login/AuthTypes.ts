export interface LoginData {
  login: {
    accessToken: string;
    refreshToken: string;
  };
}
  
export interface LoginVars {
  username: string;
  password: string;
}