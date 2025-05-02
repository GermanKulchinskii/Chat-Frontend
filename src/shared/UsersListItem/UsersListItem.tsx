import React from 'react';
import cl from './UsersListItem.module.scss';
import { ListItemButton, ListItemText } from '@mui/material';
import ChatIcon from '@/assets/chat.svg?react';
import { useChatDisplayName } from '@/hooks/useChatInitInfo';
import { Chat, PrivateChat } from '@/services/types';
import { User } from '@/store/Search/searchTypes';

export interface UsersListItemProps {
  data: Chat | PrivateChat | User;
  onClickFunc?: (data: Chat | PrivateChat | User) => void;
}

const UsersListItem: React.FC<UsersListItemProps> = ({ data, onClickFunc }) => {
  const displayName = useChatDisplayName(data);

  const handleClick = () => {
    if (onClickFunc) {
      onClickFunc(data);
    }
  };

  return (
    <ListItemButton className={cl.listItem} onClick={handleClick}>
      <ListItemText primary={"name" in data ? data?.name : data?.username} />
      <ChatIcon className={cl.icon} />
    </ListItemButton>
  );
};

export default UsersListItem;
