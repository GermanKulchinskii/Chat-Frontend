import React from 'react';
import cl from './UsersListItem.module.scss';
import { ListItemButton, ListItemText } from '@mui/material';
import ChatIcon from '@/assets/chat.svg?react';
import { User } from '@/store/Search/searchTypes';
import { Chat } from '@/widgets/UsersList/UsersList';
import { useChatDisplayName } from '@/hooks/useChatInitInfo';

export type ChatOrUser = User | Chat;

export interface UsersListItemProps {
  data: ChatOrUser;
  onClickFunc?: (data: ChatOrUser) => void;
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
      <ListItemText primary={displayName} />
      <ChatIcon className={cl.icon} />
    </ListItemButton>
  );
};

export default UsersListItem;
