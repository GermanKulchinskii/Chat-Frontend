
import { AuthSchema } from './Auth';
import { SearchSchema } from './Search';
import { apiSlice } from '../services/graphqlApi';

export interface StateSchema {
  auth: AuthSchema,
  search: SearchSchema,
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
}