'use client';

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/graphqlApi';

import { StateSchema } from './StateSchema';
import { useDispatch } from 'react-redux';
import { authReducer } from './Auth';
import { searchReducer } from './Search';
import { chatReducer } from './Chat';

export function createReduxStore(initialState?: StateSchema) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      search: searchReducer,
      chat: chatReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    devTools: true,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {},
        },
      }).concat(apiSlice.middleware),
  });

  return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
