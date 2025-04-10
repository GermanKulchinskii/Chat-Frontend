export type Message = {
  id: number,
  content: string,
  sentAt: string,
  senderId: number,
  chat_id?: number,      
  status?: "pending" | "delivered",
}

export interface ChatSchema {
  chatName?: string;
  secondUserName?: string;
  secondUserId?: number;
  chatId?: number;

  messages?: Message[];
}
