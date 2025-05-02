import cl from './PrivateChat.module.scss';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Message } from '@/store/Chat/chatTypes';
import { useLazyGetChatQuery, useStartPrivateChatMutation } from '@/services/chatApi';
import useChatWebSocket from '@/hooks/useChatWebSocket';
import MessageInput from '@/shared/MessageInput/Message.Input';
import MessagesWrapper from '@/shared/MessagesWrapper/MessagesWrapper';
import MoreIcon from '@/assets/more_icon.svg?react';
import { Button } from '@mui/material';
import { CHAT_INITIAL_MESSAGES } from '@/pages/Chat/Chat';
import Loader from '@/shared/Loader/Loader';
import { toast } from 'react-toastify';

interface PrivateChatProps {
  chatName?: string;
  secondUserName?: string;
  secondUserId?: number;
  chatId: string;
  currentUserId: number;
  currentUserName?: string;
  isError: any;
  isFetching: any;
  initialMessages: Message[];
  isGroup?: boolean;
  noChat?: boolean;
}

const PrivateChat = ({
  chatName,
  currentUserId,
  chatId,
  initialMessages,
  isError,
  isFetching,
  noChat = false,
  secondUserId,
}: PrivateChatProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const offset = useRef<number>(initialMessages.length);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [isDeleteBtn, setIsDeleteBtn] = useState(false);
  const deleteBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
    offset.current = initialMessages.length;
  }, [initialMessages]);

  const [activeChatId, setActiveChatId] = useState<string>("");
  useEffect(() => {
    if (noChat) {
      setActiveChatId("");
    } else {
      setActiveChatId(String(chatId));
    }
  }, [noChat, chatId]);

  const isFetchingRef = useRef(false);
  const [fetchChat] = useLazyGetChatQuery();

  const { messages: wsMessages, sendMessage: wsSendMessage } = useChatWebSocket({
    chatId: activeChatId,
    currentUserId:`100${currentUserId}`,
  });

  const combinedMessages = useMemo(() => [...messages, ...wsMessages], [messages, wsMessages]);
  const deliveredMessages = useMemo(
    () => combinedMessages.filter((msg) => msg.status !== 'pending'),
    [combinedMessages]
  );
  const pendingMessages = useMemo(
    () => combinedMessages.filter((msg) => msg.status === 'pending'),
    [combinedMessages]
  );

  const requestMessages = useCallback(() => {
    if (!activeChatId || noMoreMessages || isFetchingRef.current || initialMessages.length === 0) return;
    isFetchingRef.current = true;
    setLoadingOlder(true);

    fetchChat({ chatId: activeChatId, offset: offset.current, limit: CHAT_INITIAL_MESSAGES })
      .unwrap()
      .then((result) => {
        const fetched: Message[] = result.data?.getChat?.messages ?? [];
        if (fetched.length === 0) {
          setNoMoreMessages(true);
        } else {
          setMessages((prev) => [...fetched, ...prev]);
          offset.current += fetched.length;
        }
      })
      .catch((err) => console.error('Error fetching older messages:', err))
      .finally(() => {
        setLoadingOlder(false);
        isFetchingRef.current = false;
      });
  }, [activeChatId, noMoreMessages, fetchChat, initialMessages]);

  const [startPrivateChat] = useStartPrivateChatMutation();

  const handleSendMessage = useCallback(
    async (msg: string) => {
      if (!msg.trim()) return;

      console.log("handleSendMessage called", { noChat, activeChatId, secondUserId, message: msg });
      
      if (noChat && activeChatId === "" && secondUserId) {
        try {
          const result = await startPrivateChat({ secondUserId: Number(chatId.slice(3)) }).unwrap();
          const newChat = result.data.startPrivateChat;
          console.log("startPrivateChat response", newChat);
          setActiveChatId(String(newChat.id));
          if (newChat.messages && newChat.messages.length > 0) {
            setMessages(newChat.messages);
            offset.current = newChat.messages.length;
          }
          wsSendMessage(msg, currentUserId);
        } catch (error) {
          console.error("Error starting private chat", error);
          toast.error("Ошибка создания чата.");
        }
      } else {
        wsSendMessage(msg, currentUserId);
      }
    },
    [noChat, activeChatId, secondUserId, startPrivateChat, wsSendMessage, currentUserId]
  );

  const toggleDeleteBtn = useCallback(() => {
    setIsDeleteBtn((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isDeleteBtn) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (deleteBtnRef.current && !deleteBtnRef.current.contains(e.target as Node)) {
        setIsDeleteBtn(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDeleteBtn]);

  return (
    <div className={cl.widget}>
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <div className={cl.header}>
            <p className={cl.username}>{chatName}</p>
            <Button
              className={cl.iconBtn}
              onClick={toggleDeleteBtn}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <MoreIcon className={cl.icon} />
            </Button>
            {isDeleteBtn && (
              <div className={cl.deleteOption} ref={deleteBtnRef}>
                <Button className={cl.btn}>Удалить чат?</Button>
              </div>
            )}
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
            <MessageInput onSubmit={handleSendMessage} />
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateChat;
