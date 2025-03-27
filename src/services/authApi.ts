import { apiSlice } from "@/services/graphqlApi";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      {
        data: {
          register: {
            accessToken: string;
            refreshToken: string;
          };
        },
        errors: [
          { message: string }
        ]
      },
      { username: string; password: string }
    >({
      query: ({ username, password }) => ({
        body: {
          query: `
            mutation Register($username: String!, $password: String!) {
              register(input: { username: $username, password: $password }) {
                refreshToken
                accessToken
              }
            }
          `,
          variables: { username, password },
        },
      }),
    }),

    login: builder.mutation<
      {
        login: {
          accessToken: string;
          refreshToken: string;
        };
      },
      { login: string; password: string }
    >({
      query: ({ login, password }) => ({
        body: {
          query: `
            mutation Login($login: String!, $password: String!) {
              login(login: $login, password: $password) {
                accessToken
                refreshToken
              }
            }
          `,
          variables: { login, password },
        },
      }),
    }),

    refreshAccessToken: builder.mutation<
      { 
        data: {
          refreshAccessToken: {
            value: string,
            tokenType: string,
          };
        }
      },
      { refreshToken: string }
    >({
      query: ({ refreshToken }) => ({
        method: "POST",
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
      }),
    }),
    current: builder.query<
      {
        data: {
          current: {
            id: number;
            username: string;
            chats: { id: number; name: string }[];
          }
        }
      },
      void
    >({
      query: () => ({
        body: {
          query: `
            query getCurrent {
              current {
                id
                username
                chats {
                  id
                  name
                }
              }
            }
          `,
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useRegisterMutation, useLoginMutation, useRefreshAccessTokenMutation, useCurrentQuery } = authApi;
