import { ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import cl from './UsersListItem.module.scss';
import ChatIcon from '@/assets/chat.svg?react';
import { User } from '@/store/Search/searchTypes';

interface UsersListItem {
  user: User;
}

const UsersListItem = (props: UsersListItem) => {
  const {user} = props;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${user.id}`)
  }
  
  return (
    <ListItemButton onClick={handleClick} className={cl.listItem}>
      <ListItemText primary={user.username} />
      <ChatIcon className={cl.icon} />
    </ListItemButton>
  );
}

export default UsersListItem;
