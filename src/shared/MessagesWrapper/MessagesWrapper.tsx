import { useEffect, useRef } from 'react';
import { Message as MessageType } from '@/store/Chat/chatTypes';
import cl from './MessagesWrapper.module.scss';
import Message from '@/shared/Message/Message';

interface MessagesWrapperProps {
  messages: MessageType[];
  sendingMessages: MessageType[];
  requestMessages: () => void;
  currentUserId: number;
  isError: boolean;
  isFetching: boolean;
}

const MessagesWrapper = (props: MessagesWrapperProps) => {
  const { isError, isFetching, messages, sendingMessages, requestMessages, currentUserId } = props;
  const observerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // Флаг, чтобы выполнить автоскролл только один раз при первом монтировании.
  const hasScrolledInitial = useRef(false);

  console.log("MessageWrapper.tsx");

  // IntersectionObserver для подгрузки старых сообщений
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isError && isFetching) {
            requestMessages();
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
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

  const combinedMessages = [...messages, ...sendingMessages];
  combinedMessages.sort((a, b) => {
    const timeA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
    const timeB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
    return timeA - timeB;
  });

  useEffect(() => {
    if (!hasScrolledInitial.current && wrapperRef.current && messages.length > 0) {
      wrapperRef.current.scrollTo({
        top: wrapperRef.current.scrollHeight,
      });
      hasScrolledInitial.current = true;
    }
  }, [messages]);

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

export default MessagesWrapper;
