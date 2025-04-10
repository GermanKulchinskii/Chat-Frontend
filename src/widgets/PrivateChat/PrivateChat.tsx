import cl from './PrivateChat.module.scss';
import { useState } from 'react';
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
  isError: any,
  isFetching: any,
}

const PrivateChat = ({
  chatName,
  currentUserId,
  currentUserName,
  secondUserName,
  chatId,
}: PrivateChatProps) => {
  const token = localStorage.getItem('accessToken') || '';

  // Сообщения, загруженные через API (история чата)
  const [olderMessages, setOlderMessages] = useState<Message[]>([]);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [fetchChat, { isError, isFetching }] = useLazyGetChatQuery();

  // Сообщения из WebSocket
  const { messages: wsMessages, sendMessage } = useChatWebSocket({
    chatId,
    token,
  });

  // Объединяем сообщения API и WebSocket
  const combinedMessages = [...olderMessages, ...wsMessages];

  // Если необходимо, можно отсортировать по времени отправки
  combinedMessages.sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );

  // Разделяем на доставленные и ожидающие доставки (pending)
  const deliveredMessages = combinedMessages.filter(
    (msg) => msg.status !== "pending"
  );
  const pendingMessages = combinedMessages.filter(
    (msg) => msg.status === "pending"
  );

  const requestMessages = () => {
    if (!chatId || noMoreMessages || loadingOlder) return;
    setLoadingOlder(true);
    fetchChat({ chatId, offset: olderMessages.length, limit: 10 })
      .unwrap()
      .then((result) => {
        const fetched: Message[] = result.data?.getChat?.messages ?? [];
        if (fetched.length === 0) {
          setNoMoreMessages(true);
        } else {
          setOlderMessages((prev) => [...fetched, ...prev]);
        }
      })
      .catch((err) => console.error("Error fetching older messages:", err))
      .finally(() => setLoadingOlder(false));
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Отправка сообщения через WS-хук, который добавит локальную запись со статусом pending
      sendMessage(inputValue, currentUserId);
      setInputValue('');
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
          isError={isError}
          isFetching={isFetching || loadingOlder}
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
