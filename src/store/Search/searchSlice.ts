import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchSchema, User } from './searchTypes';

const initialState: SearchSchema = {
  query: '',
  groupChatQuery: '',
  foundUsers: [],
  selectedUsers: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setGroupChatSearchQuery: (state, action: PayloadAction<string>) => {
      state.groupChatQuery = action.payload;
      state.foundUsers = [];
    },
    setFoundUsers: (state, action: PayloadAction<User[]>) => {
      state.foundUsers = action.payload;
    },
    setSelectedUsers: (state, action: PayloadAction<User[]>) => {
      state.selectedUsers = action.payload;
    },
  },
});

export const { actions: searchActions } = searchSlice;
export const { reducer: searchReducer } = searchSlice;