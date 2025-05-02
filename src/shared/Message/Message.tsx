import { Message as MessageType } from '@/store/Chat/chatTypes';
import cl from './Message.module.scss';

interface MessageProps extends MessageType {
  isOwn?: boolean;
  senderName?: string;
}

const Message = (props: MessageProps) => {
  const { content, sentAt, isOwn, senderName } = props;

  return (
    <div className={`${cl.messageWrapper} ${isOwn ? cl.ownMessage : cl.otherMessage}`}>
      <p className={cl.messageContent}>{content}</p>
      <p className={cl.sentAt}>
        {new Date(sentAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) || Date.now()}
      </p>
      <p className={cl.senderName}>{senderName}</p>
    </div>
  );
};

export default Message;
