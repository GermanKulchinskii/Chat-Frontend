import cl from './PrivateChat.module.scss';
import { useState, useEffect } from 'react';
import { Message } from '@/store/Chat/chatTypes';
import { useLazyGetChatQuery } from '@/services/chatApi';
import useChatWebSocket from '@/hooks/useChatWebSocket';
import MessageInput from '@/shared/MessageInput/Message.Input';
import MessagesWrapper from '@/shared/MessagesWrapper/MessagesWrapper';

interface PrivateChatProps {
  chatName?: string;
  secondUserName?: string;
  secondUserId?: number;
  chatId: number;
  currentUserId: number;
  currentUserName?: string;
  isError: any;
  isFetching: any;
  initialMessages: Message[];
}

const PrivateChat = ({
  chatName,
  currentUserId,
  secondUserName,
  chatId,
  initialMessages,
  isError,
  isFetching,
}: PrivateChatProps) => {
  const token = localStorage.getItem('accessToken') || '';

  console.log("PrivateChat.tsx");

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const [fetchChat, { isError: isErrorFetching, isFetching: isFetchingChat }] = useLazyGetChatQuery();

  const { messages: wsMessages, sendMessage } = useChatWebSocket({
    chatId,
    token,
    currentUserId,
  });

  // Объединяем сообщения того, что получены через API и WebSocket
  const combinedMessages = [...messages, ...wsMessages];

  // Сортировка по времени отправки с проверкой поля sentAt
  combinedMessages.sort((a, b) => {
    const timeA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
    const timeB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
    return timeA - timeB;
  });

  // Разделяем сообщения на доставленные и pending
  const deliveredMessages = combinedMessages.filter(
    (msg) => msg.status !== "pending"
  );
  const pendingMessages = combinedMessages.filter(
    (msg) => msg.status === "pending"
  );

  const requestMessages = () => {
    if (!chatId || noMoreMessages || loadingOlder) return;
    setLoadingOlder(true);
    fetchChat({ chatId, offset: messages.length, limit: 10 })
      .unwrap()
      .then((result) => {
        const fetched: Message[] = result.data?.getChat?.messages ?? [];
        if (fetched.length === 0) {
          setNoMoreMessages(true);
        } else {
          // Новая порция добавляется в начало списка
          setMessages((prev) => [...fetched, ...prev]);
        }
      })
      .catch((err) => console.error("Error fetching older messages:", err))
      .finally(() => setLoadingOlder(false));
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue, currentUserId);
      setInputValue("");
    }
  };

  return (
    <div className={cl.widget}>
      <div className={cl.header}>
        <p className={cl.username}>{secondUserName || chatName}</p>
      </div>
      <div className={cl.chatWrapper}>
        <MessagesWrapper 
          messages={deliveredMessages}
          sendingMessages={pendingMessages}
          requestMessages={requestMessages}
          currentUserId={currentUserId}
          isError={isError || isErrorFetching}
          isFetching={isFetching || isFetchingChat || loadingOlder}
        />
      </div>
      <div className={cl.inputWrapper}>
        <MessageInput 
          value={inputValue} 
          setValue={setInputValue} 
          onSubmit={handleSendMessage} 
        />
      </div>
    </div>
  );
};

export default PrivateChat;
