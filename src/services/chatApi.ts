import { apiSlice } from "@/services/graphqlApi";
import { Member, Message } from "@/store/Chat/chatTypes";
import { ChatCreationData, ChatDetails } from "./types";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startOrGetPrivateChat: builder.mutation<
      {
        data: {
          startOrGetPrivateChat: { 
            id: number, 
            name: string,
            messages: Message[]
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
                messages {
                  id
                  senderId
                  content
                  sentAt
                }
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
            isGroup: boolean,
            members: Member[],
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
                isGroup
                members {
                  id
                  username
                }
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
    deleteChat: builder.mutation<
      void,
      { chatId: number }
    >({
      query: ({ chatId }) => ({
        body: {
          query: `
            mutation deleteChat($chatId: int!) {
              deleteChat(chatId: $chatId) {
              }
            }
          `,
          variables: { chatId },
        }
      }),
    }),
    startGroupChat: builder.mutation<
      ChatDetails,
      ChatCreationData
    >({
      query: (creationData: ChatCreationData) => ({
        body: {
          query: `
            mutation startGroupChat($creationData: ChatCreationData!) {
              startGroupChat(creationData: $creationData) {
                id
                name
              }
            }
          `,
          variables: { creationData },
        }
      }),
    }),
    
  }),
  overrideExisting: false,
});

export const { 
  useStartOrGetPrivateChatMutation, 
  useLazyGetChatQuery,
  useDeleteChatMutation,
  useStartGroupChatMutation,
  useGetChatQuery,
} = chatApi;
