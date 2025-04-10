import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatSchema } from './chatTypes';

const initialState: ChatSchema = {

};

const chatSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setChatInfo: (
      state,
      action: PayloadAction<{ 
        chatId?: number,
        chatName?: string, 
        secondUserId?: number, 
        secondUserName?: string, 
      }>
    ) => {
      state.chatId = action.payload.chatId;
      state.chatName = action.payload.chatName;
      state.secondUserId = action.payload.secondUserId;
      state.secondUserName = action.payload.secondUserName;
    },
    setChatId: (state, action: PayloadAction<{ chatId: number }>) => {
      state.chatId = action.payload.chatId;
    },
    setChatName: (state, action: PayloadAction<{ chatName: string }>) => {
      state.chatName = action.payload.chatName;
    },

  },
});

export const { actions: chatActions } = chatSlice;
export const { reducer: chatReducer } = chatSlice;
