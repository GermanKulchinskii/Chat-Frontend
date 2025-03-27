import cl from './EmptyUsersList.module.scss';
import EmptyUsersListIcon from '@/assets/empty_user.svg?react';

const EmptyUsersList = () => {
  return (
    <div className={cl.wrapper}>
      <EmptyUsersListIcon className={cl.image} />
      <p className={cl.title}>Пользователь не найден</p>
    </div>
  );
}

export default EmptyUsersList;
