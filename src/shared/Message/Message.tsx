import { Message as MessageType } from '@/store/Chat/chatTypes';
import cl from './Message.module.scss';

interface MessageProps extends MessageType {
  isOwn?: boolean;
}

const Message = (props: MessageProps) => {
  const { id, content, senderId, sentAt, isOwn } = props;

  return (
    <div className={`${cl.messageWrapper} ${isOwn ? cl.ownMessage : cl.otherMessage}`}>
      <p className={cl.messageContent}>{content}</p>
      <p className={cl.sentAt}>{sentAt}</p>
    </div>
  );
};

export default Message;
