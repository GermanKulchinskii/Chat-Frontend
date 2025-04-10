
import { AuthSchema } from './Auth';
import { SearchSchema } from './Search';
import { apiSlice } from '../services/graphqlApi';
import { ChatSchema } from './Chat/chatTypes';

export interface StateSchema {
  auth: AuthSchema,
  search: SearchSchema,
  chat: ChatSchema,
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
}