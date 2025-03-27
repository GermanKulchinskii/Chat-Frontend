import { StateSchema } from "@/store/StateSchema";

export const searchQuery = (state: StateSchema) => state.search.query;
export const groupChatSearchQuery = (state: StateSchema) => state.search.groupChatQuery;
export const foundUsers = (state: StateSchema) => state.search.foundUsers;
export const selectedUsers = (state: StateSchema) => state.search.selectedUsers;