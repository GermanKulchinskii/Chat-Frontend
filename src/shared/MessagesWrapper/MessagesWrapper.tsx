import React, { useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { Message as MessageType } from '@/store/Chat/chatTypes';
import cl from './MessagesWrapper.module.scss';
import Message from '@/shared/Message/Message';
import { membersSelector } from '@/store/Chat/selectors';
import { useSelector } from 'react-redux';

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

  const idFromUrl = location.pathname.split('/').at(-1) || "";
  const isChatId = idFromUrl.startsWith("200");

  const members = useSelector(membersSelector);
  
  const combinedMessages = useMemo(() => {
    const allMessages = [...messages, ...sendingMessages];
    return allMessages.sort((a, b) => {
      const timeA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
      const timeB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
      return timeA - timeB;
    });
  }, [messages, sendingMessages]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  
  const initialScrollDone = useRef(false);
  const lastCombinedMessagesCountRef = useRef<number>(combinedMessages.length);

  useEffect(() => {
    if (wrapperRef.current && combinedMessages.length && !initialScrollDone.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
      initialScrollDone.current = true;
      lastCombinedMessagesCountRef.current = combinedMessages.length;
    }
  }, [combinedMessages]);

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

  const prevMessagesLengthRef = useRef<number>(messages.length);
  const prevScrollHeightRef = useRef<number>(wrapperRef.current?.scrollHeight || 0);

  useLayoutEffect(() => {
    if (wrapperRef.current) {
      if (messages.length > prevMessagesLengthRef.current && wrapperRef.current.scrollTop < 50) {
        const newScrollHeight = wrapperRef.current.scrollHeight;
        const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
        wrapperRef.current.scrollTop = wrapperRef.current.scrollTop + scrollDiff;
      }
      prevMessagesLengthRef.current = messages.length;
      prevScrollHeightRef.current = wrapperRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!wrapperRef.current || !initialScrollDone.current) return;

    if (combinedMessages.length > lastCombinedMessagesCountRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = wrapperRef.current;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const threshold = 100;
      if (distanceFromBottom < threshold) {
        wrapperRef.current.scrollTop = scrollHeight;
      }
    }
    lastCombinedMessagesCountRef.current = combinedMessages.length;
  }, [combinedMessages]);
  
  return (
    <div className={cl.wrapper} ref={wrapperRef}>
      <div className={cl.sentinel} ref={observerRef} />
      <div className={cl.messagesList}>
        {combinedMessages.map((message, index) => (
          <Message
            key={message.id ? `${message.id}-${index}` : `msg-${index}`}
            {...message}
            isOwn={message.senderId === currentUserId || message.sender_id === currentUserId}
            senderName={
              isChatId && message?.senderId !== currentUserId && message?.sender_id !== currentUserId
                ? members?.find((member) => member.id === message.senderId || member.id === message.sender_id)?.username
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(MessagesWrapper);
