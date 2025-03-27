import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchSchema } from './searchTypes';

const initialState: SearchSchema = {
  query: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const { actions: searchActions } = searchSlice;
export const { reducer: searchReducer } = searchSlice;