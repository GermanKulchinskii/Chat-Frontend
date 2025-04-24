export type Message = {
  id: number,
  senderId: number,
  content: string,
  sentAt: string,
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