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
import DeleteChatModal from '../DeleteChatModal/DeleteChatModal';
import { useSelector } from 'react-redux';
import { chatIdSelector } from '@/store/Chat/selectors';

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const globalChatId = useSelector(chatIdSelector);

  const isGroupChat = chatId.startsWith("200");

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
    currentUserId: `100${currentUserId}`,
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
          console.log("Вызов wsSendMessage", msg, currentUserId);
          wsSendMessage(msg, currentUserId);
        } catch (error) {
          console.error("Error starting private chat", error);
          toast.error("Ошибка создания чата.");
        }
      } else {
        wsSendMessage(msg, currentUserId);
      }
    },
    [noChat, activeChatId, secondUserId, startPrivateChat, wsSendMessage, currentUserId, chatId]
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
            {isGroupChat && (
              <Button
                className={cl.iconBtn}
                onClick={toggleDeleteBtn}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <MoreIcon className={cl.icon} />
              </Button>
            )}
            {isGroupChat && isDeleteBtn && (
              <div className={cl.deleteOption} ref={deleteBtnRef}>
                <Button className={cl.btn} onClick={() => setIsDeleteModalOpen(true)}>
                  Удалить чат?
                </Button>
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
          {isGroupChat && isDeleteModalOpen && <div className={cl.overlay} />}
          {isGroupChat && isDeleteModalOpen && (
            <div className={cl.modalWrapper}>
              <DeleteChatModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} chatId={globalChatId} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PrivateChat;
