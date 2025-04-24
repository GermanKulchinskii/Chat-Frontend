import { Box, CircularProgress, List } from "@mui/material";
import { useFindUsersQuery } from "@/services/searchUsersApi";
import cl from './GroupSearchUserList.module.scss';
import EmptyUsersList from "@/shared/EmptyUsersList/EmptyUsersList";
import EmptyInput from "@/shared/EmptyInput/EmptyInput";
import GroupSearchUsersListItem from "@/shared/GroupSearchUsersListItem/GroupSearchUsersListItem";
import { useSelector } from "react-redux";
import { selectedUsers } from "@/store/Search/selectors";

interface GroupSearchUserListProps {
  search: string;
}

const GroupSearchUserList = ({ search }: GroupSearchUserListProps) => {
  const isSearchMode = search.length >= 2;
  const addedUsers = useSelector(selectedUsers);
  
  const { data, isFetching, isError } = useFindUsersQuery(
    { username: search },
    { skip: !isSearchMode }
  );

  const users = data?.data?.findUsers || [];

  let listContent;
  if (isSearchMode) {
    listContent = users.length ? (
      users.map((user) => (
        <GroupSearchUsersListItem key={user.id} user={user} />
      ))
    ) : (
      <EmptyUsersList />
    );
  } else {
    listContent = addedUsers.length ? (
      addedUsers.map((user: any) => (
        <GroupSearchUsersListItem key={user.id} user={user} />
      ))
    ) : (
      <EmptyInput />
    );
  }

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
        {listContent}
      </List>
    </Box>
  );
};

export default GroupSearchUserList;
