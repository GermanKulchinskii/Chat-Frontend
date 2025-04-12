import React, { useEffect, useRef, useMemo } from 'react';
import { Message as MessageType } from '@/store/Chat/chatTypes';
import cl from './MessagesWrapper.module.scss';
import Message from '@/shared/Message/Message';

interface ChatMessagesProps {
  messages: MessageType[];
  sendingMessages: MessageType[];
  requestMessages: () => void;
  currentUserId: number;
  isError: boolean;
  isFetching: boolean;
}

const MessagesWrapper: React.FC<ChatMessagesProps> = (props) => {
  const { isError, isFetching, messages, sendingMessages, requestMessages, currentUserId } = props;
  
  const combinedMessages = useMemo(() => {
    const allMessages = [...messages, ...sendingMessages];
    return allMessages.sort((a, b) => {
      const timeA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
      const timeB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
      return timeA - timeB;
    });
  }, [messages, sendingMessages]);

  const observerRef = useRef<HTMLDivElement | null>(null);
  // Флаг нужен для исполнения эффекта прокрута вниз единожды
  const scrollFlag = useRef(false);
  // Сам элемент, который крутим
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollFlag.current && wrapperRef.current && combinedMessages.length) {
      wrapperRef.current.scrollTo(0, wrapperRef.current.scrollHeight);
      scrollFlag.current = true;
      return;
    }

    if (wrapperRef.current && combinedMessages.length && combinedMessages.at(-1)!.senderId === currentUserId) {
      wrapperRef.current.scrollTo(0, wrapperRef.current.scrollHeight);
    }
  }, [combinedMessages])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isError && !isFetching) {
            requestMessages();
          }
        });
      },
      { root: null, threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [requestMessages, isError, isFetching]);

  return (
    <div className={cl.wrapper} ref={wrapperRef}>
      <div className={cl.sentinel} ref={observerRef} />

      <div className={cl.messagesList}>
        {combinedMessages.map((message, index) => (
          <Message
            key={message.id ? `${message.id}-${index}` : `msg-${index}`}
            {...message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(MessagesWrapper);
