import cl from './PrivateChat.module.scss';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Message } from '@/store/Chat/chatTypes';
import { useLazyGetChatQuery } from '@/services/chatApi';
import useChatWebSocket from '@/hooks/useChatWebSocket';
import MessageInput from '@/shared/MessageInput/Message.Input';
import MessagesWrapper from '@/shared/MessagesWrapper/MessagesWrapper';
import MoreIcon from '@/assets/more_icon.svg?react';
import { Button } from '@mui/material';
import { useChatDisplayName } from '@/hooks/useChatInitInfo';
import { CHAT_INITIAL_MESSAGES } from '@/pages/Chat/Chat';
import Loader from '@/shared/Loader/Loader';

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
  isGroup: boolean;
}

const PrivateChat = ({
  chatName,
  currentUserId,
  secondUserName,
  chatId,
  initialMessages,
  isError,
  isFetching,
  isGroup,
}: PrivateChatProps) => {
  const displayName = useChatDisplayName({ name: chatName, username: secondUserName, isGroup });
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

  const isFetchingRef = useRef(false);
  const [fetchChat] = useLazyGetChatQuery();

  const { messages: wsMessages, sendMessage } = useChatWebSocket({ chatId, currentUserId });

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
    if (!chatId || noMoreMessages || isFetchingRef.current || initialMessages.length === 0) return;
    isFetchingRef.current = true;
    setLoadingOlder(true);

    fetchChat({ chatId, offset: offset.current, limit: CHAT_INITIAL_MESSAGES })
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
  }, [chatId, noMoreMessages, fetchChat, initialMessages]);

  const handleSendMessage = useCallback(
    (msg: string) => {
      if (msg.trim()) {
        sendMessage(msg, currentUserId);
      }
    },
    [sendMessage, currentUserId]
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
            <p className={cl.username}>{displayName}</p>
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
