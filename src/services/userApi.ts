import { apiSlice } from "@/services/graphqlApi";
import { ErrorType } from "./types";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findUserById: builder.query<
      {
        data: {
          findUserById: {
            id: number;
            username: string;
          };
        },
        errors: ErrorType[]
      },
      { userId: number }
    >({
      query: ({ userId }) => ({
        body: {
          query: `
            query findUserById($userId: Int!) {
              findUserById(userId: $userId) {
                id
                username
              }
            }
          `,
          variables: { userId },
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useFindUserByIdQuery,
  useLazyFindUserByIdQuery,
} = userApi;
