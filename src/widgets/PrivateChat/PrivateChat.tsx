import cl from './PrivateChat.module.scss';
import { useState, useEffect, useMemo, useCallback } from 'react';
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

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const [fetchChat, { isError: isErrorFetching, isFetching: isFetchingChat }] = useLazyGetChatQuery();

  const { messages: wsMessages, sendMessage } = useChatWebSocket({
    chatId,
    token,
    currentUserId,
  });

  // Объединяем сообщения из API и WebSocket
  const combinedMessages = useMemo(() => [...messages, ...wsMessages], [messages, wsMessages]);
  const deliveredMessages = useMemo(
    () => combinedMessages.filter((msg) => msg.status !== "pending"),
    [combinedMessages]
  );
  const pendingMessages = useMemo(
    () => combinedMessages.filter((msg) => msg.status === "pending"),
    [combinedMessages]
  );

  const requestMessages = useCallback(() => {
    if (!chatId || noMoreMessages || loadingOlder) return;
    setLoadingOlder(true);
    fetchChat({ chatId, offset: messages.length, limit: 10 })
      .unwrap()
      .then((result) => {
        const fetched: Message[] = result.data?.getChat?.messages ?? [];
        if (fetched.length === 0) {
          setNoMoreMessages(true);
        } else {
          setMessages((prev) => [...fetched, ...prev]);
        }
      })
      .catch((err) => console.error("Error fetching older messages:", err))
      .finally(() => setLoadingOlder(false));
  }, [chatId, noMoreMessages, loadingOlder, fetchChat, messages.length]);

  // onSubmit для MessageInput теперь получает значение сообщения и вызывает sendMessage
  const handleSendMessage = useCallback((msg: string) => {
    if (msg.trim()) {
      sendMessage(msg, currentUserId);
    }
  }, [sendMessage, currentUserId]);

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
        <MessageInput onSubmit={handleSendMessage} />
      </div>
    </div>
  );
};

export default PrivateChat;
