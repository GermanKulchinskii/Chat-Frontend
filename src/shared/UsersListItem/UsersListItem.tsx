import React from 'react';
import cl from './UsersListItem.module.scss';
import { ListItemButton, ListItemText } from '@mui/material';
import ChatIcon from '@/assets/chat.svg?react';
import { User } from '@/store/Search/searchTypes';
import { Chat } from '@/widgets/UsersList/UsersList';
import { useSelector } from 'react-redux';
import { usernameSelector } from '@/store/Auth/selector';

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

  const currentUserName = useSelector(usernameSelector);

  const getChatDisplayName = (chatName: string, currentUserName: string | undefined): string => {
    const matches = chatName.match(/Чат между (\S+) и (\S+)/);
    if (matches) {
      const [, name1, name2] = matches;
      return name1 === currentUserName ? name2 : name1;
    }
    return "Чат";
  };
  
  const displayName = "username" in data
    ? data.username
    : isChat(data)
    ? getChatDisplayName(data.name, currentUserName)
    : "Чат";

  return (
    <ListItemButton className={cl.listItem} onClick={handleClick}>
      <ListItemText primary={displayName} />
      <ChatIcon className={cl.icon} />
    </ListItemButton>
  );
};

export default UsersListItem;
