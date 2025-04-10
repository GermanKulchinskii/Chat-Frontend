import { StateSchema } from "@/store/StateSchema";

export const isAuthenticated = (state: StateSchema) => state.auth.isAuthenticated;
export const isLoading = (state: StateSchema) => state.auth.isLoading;
export const accessToken = (state: StateSchema) => state.auth.accessToken;
export const refreshToken = (state: StateSchema) => state.auth.refreshToken;
export const userIdSelector = (state: StateSchema) => state.auth.userId;
export const usernameSelector = (state: StateSchema) => state.auth.username;