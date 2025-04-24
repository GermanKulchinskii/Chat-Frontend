import React, { useEffect, useState } from "react";
import { ListItemButton, ListItemText } from "@mui/material";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { selectedUsers } from "@/store/Search/selectors";
import { searchActions } from "@/store/Search";
import cl from './GroupSearchUsersListItem.module.scss';
import AddPersonIcon from '@/assets/person_add.svg?react';
import RemovePersonIcon from '@/assets/remove.svg?react';
import { User } from "@/store/Search/searchTypes";
import { toast } from "react-toastify";

interface GroupSearchUsersListItemProps {
  user: User;
}

const GroupSearchUsersListItem: React.FC<GroupSearchUsersListItemProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const currentFoundUsers = useSelector(selectedUsers) as User[];

  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const found = currentFoundUsers.some((foundUser: User) => foundUser.id === user.id);
    setIsAdded(found);
  }, [currentFoundUsers, user.id]);

  const handleAdd = () => {
    if (isAdded) {
      const newSelectedUsers = currentFoundUsers.filter((foundUser: User) => foundUser.id !== user.id);
      dispatch(searchActions.setSelectedUsers(newSelectedUsers));
      setIsAdded(!isAdded);
    } else if (currentFoundUsers.length > 6) {
      toast.error("А не много ли у тебя друзей?");
    } else {
      const newSelectedUsers = [...currentFoundUsers, user];
      dispatch(searchActions.setSelectedUsers(newSelectedUsers));
      setIsAdded(!isAdded);
    }
  };

  return (
    <ListItemButton onClick={handleAdd} className={cl.listItem}>
      <ListItemText primary={user.username} />
      {isAdded ? (
        <RemovePersonIcon className={cl.icon} />
      ) : (
        <AddPersonIcon className={cl.icon} />
      )}
    </ListItemButton>
  );
};

export default GroupSearchUsersListItem;
