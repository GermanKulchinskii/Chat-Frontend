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

// Определяем интерфейс для объекта GraphQL-запроса.
// Он расширяет FetchArgs (за исключением body, чтобы задать свою структуру) и делает
// url и method необязательными, поскольку мы будем задавать их по умолчанию.
interface GraphQLArgs extends Partial<Omit<FetchArgs, 'body'>> {
  body: {
    query: string;
    variables?: Record<string, any>;
  };
}

// Функция prepareArgs принимает аргумент, который может быть строкой,
// объектом типа FetchArgs или объектом GraphQLArgs.
// Если передан объект с body, мы задаём url и method по умолчанию (если их нет).
const prepareArgs = (
  args: string | FetchArgs | GraphQLArgs
): string | FetchArgs => {
  if (typeof args === 'object' && 'body' in args) {
    // Приводим args к нашему интерфейсу GraphQLArgs
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
  // Ждем, если сейчас происходит обновление токена
  await mutex.waitForUnlock();

  let result = await graphqlBaseQueryRaw(prepareArgs(args), api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Если получена ошибка авторизации, пытаемся обновить токен
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = localStorage.getItem(REFRESH_LOCALSTORAGE_KEY);
        if (!refreshToken) {
          // Нет refresh-токена – сбрасываем авторизацию
          api.dispatch(authActions.logout());
          return result;
        }
        // Выполняем GraphQL-мутацию для обновления access token
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
          // Повторно выполняем исходный запрос, теперь с обновлённым токеном
          result = await graphqlBaseQueryRaw(prepareArgs(args), api, extraOptions);
        } else {
          // Если обновление токена не удалось, выполняем логаут
          api.dispatch(authActions.logout());
        }
      } finally {
        release();
      }
    } else {
      // Если мьютекс заблокирован, ждем его освобождения и повторяем запрос
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
