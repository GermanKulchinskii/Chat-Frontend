export type Message = {
  id: number,
  senderId: number,
  content: string,
  sentAt: string,
  sender_id?: number,
}

export type ChatDetails = {
  data: {
    startGroupChat: {
      id: number,
      name: string,
      messages: Message[]
    }
  }
}

export type ChatCreationData = {
  name: string,
  memberIds: number[],
}

export type PrivateChat = {
  id: number,
  name: string,
  chatmembers: {
    id: number,
    username: string,
  }[],
}

export type Chat = {
  id: number,
  name: string,
  sequentialNumber: number,
  chatmembers: {
    id: number,
    username: string,
  }[],
}

export type ErrorType = {
  message: string
}