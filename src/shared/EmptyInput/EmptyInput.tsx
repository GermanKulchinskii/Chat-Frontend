import cl from './EmptyInput.module.scss';
import EmptyInputIcon from '@/assets/contract.svg?react';

const EmptyInput = () => {
  return (
    <div className={cl.wrapper}>
      <EmptyInputIcon className={cl.image} />
      <p className={cl.title}>Введите имя пользователя</p>
    </div>
  );
}

export default EmptyInput;
