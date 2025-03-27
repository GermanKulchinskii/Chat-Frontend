import { Box, CircularProgress, List } from "@mui/material";
import { useFindUsersQuery } from "@/services/searchUsersApi";
import cl from './GroupSearchUserList.module.scss';
import EmptyUsersList from "@/shared/EmptyUsersList/EmptyUsersList";
import EmptyInput from "@/shared/EmptyInput/EmptyInput";
import GroupSearchUsersListItem from "@/shared/GroupSearchUsersListItem/GroupSearchUsersListItem";

interface User {
  id: number;
  username: string;
}

interface GroupSearchUserListProps {
  search: string;
}

const GroupSearchUserList = ({ search }: GroupSearchUserListProps) => {
  const isSearchMode = search.length >= 2;

  const { data, isFetching, isError } = useFindUsersQuery(
    { username: search },
    { skip: !isSearchMode }
  );

  const users: User[] = data?.data?.findUsers || [];
  return (
    <Box className={cl.usersListWrapper}>
      {isFetching && (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress color="inherit" />
        </Box>
      )}
      {isError && (
        <Box color="error.main" textAlign="center">
          Ошибка загрузки пользователей.
        </Box>
      )}
      <List className={cl.userList}>
        {isSearchMode ? (
          users.length > 0 ? (
            users.map((user) => (
              <GroupSearchUsersListItem key={user.id} user={user} />
            ))
          ) : (
            <EmptyUsersList />
          )
        ) : (
          <EmptyInput />
        )}
      </List>
    </Box>
  );
};

export default GroupSearchUserList;
