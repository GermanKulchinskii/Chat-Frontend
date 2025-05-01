import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

import { authActions } from '@/store/Auth';
import {
  ACCESS_LOCALSTORAGE_KEY,
  REFRESH_LOCALSTORAGE_KEY,
} from '../constants/localStorage';

const SERVER_URL = 'http://localhost:8000/graphql';
const mutex = new Mutex();

interface GraphQLArgs extends Partial<Omit<FetchArgs, 'body'>> {
  body: {
    query: string;
    variables?: Record<string, any>;
  };
}

const prepareArgs = (
  args: string | FetchArgs | GraphQLArgs
): string | FetchArgs => {
  if (typeof args === 'object' && 'body' in args) {
    const { body, ...rest } = args as GraphQLArgs;
    return {
      ...rest,
      url: rest.url ?? '',
      method: rest.method ?? 'POST',
      body,
    };
  }
  return args;
};

const graphqlBaseQueryRaw = fetchBaseQuery({
  baseUrl: SERVER_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(ACCESS_LOCALSTORAGE_KEY);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const graphqlBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs | GraphQLArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await graphqlBaseQueryRaw(prepareArgs(args), api, extraOptions);

  const isTokenInvalid =
    (result.error && result.error.status === 401) ||
    (result.data &&
      (result.data as any).errors &&
      (result.data as any).errors.some((err: any) => typeof err.message === 'string' && err.message.startsWith('401:')));

  if (isTokenInvalid) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = localStorage.getItem(REFRESH_LOCALSTORAGE_KEY);
        if (!refreshToken) {
          api.dispatch(authActions.logout());
          return result;
        }
        const refreshResult = await graphqlBaseQueryRaw(
          {
            url: '',
            method: 'POST',
            body: {
              query: `
                mutation refreshAccessToken($refreshToken: String!) {
                  refreshAccessToken(refreshToken: $refreshToken) {
                    value
                  }
                }
              `,
              variables: { refreshToken },
            },
          },
          api,
          extraOptions,
        );

        if (
          refreshResult.data &&
          (refreshResult.data as any).data &&
          (refreshResult.data as any).data.refreshAccessToken &&
          (refreshResult.data as any).data.refreshAccessToken.value
        ) {
          const newAccessToken = (refreshResult.data as any).data.refreshAccessToken.value;
          localStorage.setItem(ACCESS_LOCALSTORAGE_KEY, newAccessToken);
          api.dispatch(authActions.setAuth());
          result = await graphqlBaseQueryRaw(prepareArgs(args), api, extraOptions);
        } else {
          api.dispatch(authActions.logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await graphqlBaseQueryRaw(prepareArgs(args), api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'rtkApiAuth',
  baseQuery: graphqlBaseQueryWithReauth,
  endpoints: (builder) => ({}),
});
