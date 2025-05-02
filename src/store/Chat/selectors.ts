import { StateSchema } from "../StateSchema";

export const chatNameSelector = (state: StateSchema) => state.chat.chatName;
export const secondUserNameSelector = (state: StateSchema) => state.chat.secondUserName;
export const secondUserIdSelector = (state: StateSchema) => state.chat.secondUserId;
export const chatIdSelector = (state: StateSchema) => state.chat.chatId;
export const membersSelector = (state: StateSchema) => state.chat.members;
