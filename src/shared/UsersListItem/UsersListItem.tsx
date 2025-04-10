import React from 'react';
import cl from './UsersListItem.module.scss';
import { ListItemButton, ListItemText } from '@mui/material';
import ChatIcon from '@/assets/chat.svg?react';
import { User } from '@/store/Search/searchTypes';
import { Chat } from '@/widgets/UsersList/UsersList';

export type ChatOrUser = User | Chat;

export interface UsersListItemProps {
  data: ChatOrUser;
  onClickFunc?: (data: ChatOrUser) => void;
}

const isChat = (data: ChatOrUser): data is Chat => {
  return 'name' in data && typeof (data as any).name === 'string';
};

const UsersListItem: React.FC<UsersListItemProps> = ({ data, onClickFunc }) => {
  const handleClick = () => {
    if (onClickFunc) {
      onClickFunc(data);
    }
  };

  const displayName =
    "username" in data
      ? data.username
      : isChat(data)
      ? data.name.split(" ").at(-1) || "Чат"
      : "Чат";

  return (
    <ListItemButton className={cl.listItem} onClick={handleClick}>
      <ListItemText primary={displayName} />
      <ChatIcon className={cl.icon} />
    </ListItemButton>
  );
};

export default UsersListItem;
