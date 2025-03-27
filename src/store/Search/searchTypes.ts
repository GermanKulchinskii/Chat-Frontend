export type User = {
  id: number;
  username: string;
}

export type SearchSchema = {
  query: string;
  groupChatQuery: string;
  foundUsers: User[];
  selectedUsers: User[];
}