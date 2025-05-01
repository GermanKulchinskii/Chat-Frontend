import { Box, List } from "@mui/material";
import { useFindUsersQuery } from "@/services/searchUsersApi";
import cl from "./GroupSearchUserList.module.scss";
import EmptyUsersList from "@/shared/EmptyUsersList/EmptyUsersList";
import EmptyInput from "@/shared/EmptyInput/EmptyInput";
import GroupSearchUsersListItem from "@/shared/GroupSearchUsersListItem/GroupSearchUsersListItem";
import { useSelector } from "react-redux";
import { selectedUsers } from "@/store/Search/selectors";
import Loader from "@/shared/Loader/Loader";

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

  let content: React.ReactNode;

  switch (true) {
    case isError:
      content = (
        <Box color="error.main" textAlign="center">
          Ошибка загрузки пользователей.
        </Box>
      );
      break;
    case isFetching:
      content = <Loader />;
      break;
    case isSearchMode && users.length > 0:
      content = users.map((user) => (
        <GroupSearchUsersListItem key={user.id} user={user} />
      ));
      break;
    case isSearchMode && users.length === 0:
      content = <EmptyUsersList />;
      break;
    case !isSearchMode && addedUsers.length > 0:
      content = addedUsers.map((user: any) => (
        <GroupSearchUsersListItem key={user.id} user={user} />
      ));
      break;
    case !isSearchMode && addedUsers.length === 0:
      content = <EmptyInput />;
      break;
    default:
      content = null;
  }

  return (
    <Box className={cl.usersListWrapper}>
      <List className={cl.userList}>{content}</List>
    </Box>
  );
};

export default GroupSearchUserList;
