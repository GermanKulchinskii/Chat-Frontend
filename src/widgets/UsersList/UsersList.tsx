import { Box, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { useFindUsersQuery } from "@/services/searchUsersApi";
import { useCurrentQuery } from "@/services/authApi";
import cl from './UsersList.module.scss';
import EmptyChats from "@/shared/EmptyChats/EmptyChats";
import EmptyUsersList from "@/shared/EmptyUsersList/EmptyUsersList";
import UsersListItem from "@/shared/UsersListItem/UsersListItem";

interface User {
  id: number;
  username: string;
}

interface Chat {
  id: number;
  name: string;
}

interface UserSelf {
  id: number;
  username: string;
  chats: Chat[];
}

interface UsersListProps {
  search: string;
}

const UsersList = ({ search }: UsersListProps) => {
  const isSearchMode = search.length >= 2;
  const {
    data: findUsersData,
    isFetching: isFetchingFindUsers,
    isError: isErrorFindUsers,
  } = useFindUsersQuery(
    { username: search },
    { skip: !isSearchMode }
  );

  const {
    data: currentData,
    isFetching: isFetchingCurrent,
    isError: isErrorCurrent,
  } = useCurrentQuery(undefined, { skip: isSearchMode });

  const users: User[] = isSearchMode
    ? findUsersData?.data?.findUsers || []
    : [];
  const chats: Chat[] = !isSearchMode
    ? currentData?.data?.current?.chats || []
    : [];

  const isFetching = isSearchMode ? isFetchingFindUsers : isFetchingCurrent;
  const isError = isSearchMode ? isErrorFindUsers : isErrorCurrent;

  return (
    <Box className={cl.usersListWrapper}>
      {isFetching && (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress color="inherit" />
        </Box>
      )}
      {isError && (
        <Box color="error.main" textAlign="center">
          Ошибка загрузки {isSearchMode ? "пользователей" : "чатов"}.
        </Box>
      )}
      <List className={cl.userList}>
        {isSearchMode ? (
          users.length > 0 ? (
            users.map((user) => (
              <UsersListItem key={user.id} user={user} />
            ))
          ) : (
            <EmptyUsersList />
          )
        ) : (
          chats.length > 0 ? (
            chats.map((chat) => (
              <ListItem key={chat.id} className={cl.listItem}>
                <ListItemText primary={chat.name} />
              </ListItem>
            ))
          ) : (
            <EmptyChats />
          )
        )}
      </List>
    </Box>
  );
};

export default UsersList;
