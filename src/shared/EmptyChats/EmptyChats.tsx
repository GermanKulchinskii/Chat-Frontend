import cl from './EmptyChats.module.scss';
import EmptyChatIcon from '@/assets/empty_chat.svg?react';

const EmptyChats = () => {
  return (
    <div className={cl.wrapper}>
      <EmptyChatIcon className={cl.image} />
      <p className={cl.title}>У вас нет чатов</p>
    </div>
  );
}

export default EmptyChats;
