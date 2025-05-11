export type Message = {
  id: number,
  content: string,
  sentAt: string,
  senderId: number,
  chat_id?: number | string,      
  status?: "pending" | "delivered",
  sender_id?: number,
}

export type Member = {
  id: number,
  username: string,
}


export interface ChatSchema {
  chatName?: string;
  secondUserName?: string;
  secondUserId?: number;
  chatId?: number;
  members?: Member[];
  messages?: Message[];
}
