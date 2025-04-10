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
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isError && isFetching) {
            requestMessages();
            console.log("Запрос старых сообщений");
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

  return (
    <div className={cl.wrapper}>
      <div className={cl.sentinel} ref={observerRef} />

      <div className={cl.messagesList}>
        {messages.map((message) => (
          <Message
            key={message.id}
            {...message}
            isOwn={message.senderId === currentUserId}
          />
        ))}

        {sendingMessages.map((message) => (
          <Message
            key={`sending-${message.id}`}
            {...message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default MessagesWrapper;
