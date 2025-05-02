import React from 'react';
import cl from './UsersListItem.module.scss';
import { Box, ListItemButton, ListItemText } from '@mui/material';
import ChatIcon from '@/assets/chat.svg?react';
import { Chat, PrivateChat } from '@/services/types';
import { User } from '@/store/Search/searchTypes';
import GroupChatIcon from '@/assets/group_icon.svg?react';

export interface UsersListItemProps {
  data: Chat | PrivateChat | User;
  onClickFunc?: (data: Chat | PrivateChat | User) => void;
}

const UsersListItem: React.FC<UsersListItemProps> = ({ data, onClickFunc }) => {
  const isGroupChat = "sequentialNumber" in data;

  const handleClick = () => {
    if (onClickFunc) {
      onClickFunc(data);
    }
  };

  return (
    <ListItemButton className={cl.listItem} onClick={handleClick}>
      {isGroupChat ? (
        <Box className={cl.groupWrapper}>
          <GroupChatIcon className={cl.icon} />
          <ListItemText primary={data?.name} />
        </Box>
      ) : (
        <ListItemText primary={"name" in data ? data?.name : data?.username} />
      )}
      
      <ChatIcon className={cl.icon} />
    </ListItemButton>
  );
};

export default UsersListItem;
