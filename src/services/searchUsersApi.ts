import { apiSlice } from "@/services/graphqlApi";

export const searchUsersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findUsers: builder.query<
    {
      data: {
        findUsers: { id: number, username: string }[]
      }
    },
    { username: string }
  >({
    query: ({ username }) => ({
        body: {
          query: `
            query findUsers($username: String!) {
              findUsers(username: $username) {
                id
                username
              }
            }
          `,
          variables: { username },
        },
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useFindUsersQuery } = searchUsersApi;