import { apiSlice } from "@/services/graphqlApi";
import { Message } from "@/store/Chat/chatTypes";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startOrGetPrivateChat: builder.mutation<
      {
        data: {
          startOrGetPrivateChat: { 
            id: number, 
            name: string,
          }
        }
      },
      { secondUserId: number }
    >({
      query: ({ secondUserId }) => ({
        body: {
          query: `
            mutation startOrGetPrivateChat($secondUserId: Int!) {
              startOrGetPrivateChat(secondUserId: $secondUserId) {
                id
                name
              }
            }
          `,
          variables: { secondUserId },
        },
      }),
    }),
    getChat: builder.query<
      {
        data: {
          getChat: { 
            id: number,
            name: string,
            messages: Message[]
          }
        }
      },
      { chatId: number; offset?: number; limit?: number }
    >({
      query: ({ chatId, offset = 0, limit = 10 }) => ({
        body: {
          query: `
            query getChat($chatId: Int!, $offset: Int!, $limit: Int!) {
              getChat(chatId: $chatId, offset: $offset, limit: $limit) {
                id
                name
                messages {
                  id
                  senderId
                  content
                  sentAt
                }
              }
            }
          `,
          variables: { chatId, offset, limit },
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useStartOrGetPrivateChatMutation, 
  useLazyGetChatQuery 
} = chatApi;
