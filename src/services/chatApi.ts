import { apiSlice } from "@/services/graphqlApi";
import { Member, Message } from "@/store/Chat/chatTypes";
import { ChatCreationData, ChatDetails, ErrorType } from "./types";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startPrivateChat: builder.mutation<
      {
        data: {
          startPrivateChat: { 
            id: number, 
            name: string,
            messages: Message[],
            members: {
              id: number,
              username: string,
            }
          }
        }
      },
      { secondUserId: number }
    >({
      query: ({ secondUserId }) => ({
        body: {
          query: `
            mutation startPrivateChat($secondUserId: Int!) {
              startPrivateChat(secondUserId: $secondUserId) {
                id
                name
                members {
                  id
                  username
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
          getChat?: { 
            id: number,
            name: string,
            members: Member[],
            messages: Message[]
          },
        }
        errors?: ErrorType[]
      },
      { chatId: string; offset?: number; limit?: number }
    >({
      query: ({ chatId, offset = 0, limit = 10 }) => ({
        body: {
          query: `
            query getChat($chatId: String!, $offset: Int!, $limit: Int!) {
              getChat(chatId: $chatId, offset: $offset, limit: $limit) {
                id
                name
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
            mutation deleteChat($chatId: Int!) {
              deleteChat(chatId: $chatId)
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
  useStartPrivateChatMutation, 
  useLazyGetChatQuery,
  useDeleteChatMutation,
  useStartGroupChatMutation,
  useGetChatQuery,
} = chatApi;
