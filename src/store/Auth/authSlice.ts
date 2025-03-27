import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthSchema } from './authTypes';

const initialState: AuthSchema = {
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state) => {
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    loginSuccess: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = undefined;
      state.refreshToken = undefined;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
  },
});

export const { actions: authActions } = authSlice;
export const { reducer: authReducer } = authSlice;
