import React, { useEffect } from "react";
import { Box, List } from "@mui/material";
import { useFindUsersQuery } from "@/services/searchUsersApi";
import { useCurrentQuery } from "@/services/authApi";
import cl from "./UsersList.module.scss";
import EmptyChats from "@/shared/EmptyChats/EmptyChats";
import EmptyUsersList from "@/shared/EmptyUsersList/EmptyUsersList";
import UsersListItem, { ChatOrUser } from "@/shared/UsersListItem/UsersListItem";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/store";
import { authActions } from "@/store/Auth";
import { chatActions } from "@/store/Chat";
import Loader from "@/shared/Loader/Loader";

interface User {
  id: number;
  username: string;
}

export interface Chat {
  id: number;
  name: string;
  isGroup: boolean;
  chatmembers: {
    id: number;
    username: string;
  }[];
}

interface UsersListProps {
  search: string;
}

const UsersList = ({ search }: UsersListProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isSearchMode = search.length >= 2;

  const {
    data: findUsersData,
    isFetching: isFetchingFindUsers,
    isError: isErrorFindUsers,
  } = useFindUsersQuery(
    { username: search },
    { skip: !isSearchMode, refetchOnMountOrArgChange: true }
  );

  const {
    data: currentData,
    isFetching: isFetchingCurrent,
    isError: isErrorCurrent,
  } = useCurrentQuery(undefined, {
    skip: isSearchMode,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isSearchMode && currentData?.data?.current) {
      const currentUser = currentData.data.current;
      dispatch(
        authActions.setUserInfo({
          username: currentUser.username,
          userId: currentUser.id,
        })
      );
    }
  }, [currentData, isSearchMode, dispatch]);

  const handleChatNavigate = (data: ChatOrUser) => {
    const currentUserId = currentData?.data?.current?.id;
    const oppositeMember =
      "isGroup" in data && !data.isGroup && data.chatmembers
        ? data.chatmembers.find((member) => member.id !== currentUserId)
        : undefined;

    const payload = !("isGroup" in data)
      ? {
          chatId: data.id,
          chatName: data.username,
          secondUserId: data.id,
          secondUserName: data.username,
        }
      : data.isGroup
      ? {
          chatId: data.id,
          chatName: data.name,
          secondUserId: undefined,
          secondUserName: undefined,
        }
      : {
          chatId: data.id,
          chatName: oppositeMember ? oppositeMember.username : "",
          secondUserId: oppositeMember ? oppositeMember.id : undefined,
          secondUserName: oppositeMember ? oppositeMember.username : "",
        };

    dispatch(chatActions.setChatInfo(payload));
    navigate(`/chat/${data.id}`);
  };

  const users: User[] = isSearchMode
    ? findUsersData?.data?.findUsers || []
    : [];
  const chats: Chat[] = !isSearchMode
    ? currentData?.data?.current?.chats || []
    : [];


  const isError = isSearchMode ? isErrorFindUsers : isErrorCurrent;

  let listContent: React.ReactNode = null;

  switch (true) {
    case isSearchMode && isFetchingFindUsers:
      listContent = <Loader />;
      break;
    case isSearchMode && users.length > 0:
      listContent = users.map((user) => (
        <UsersListItem key={user.id} data={user} onClickFunc={handleChatNavigate} />
      ));
      break;
    case isSearchMode && !isFetchingFindUsers && users.length === 0:
      listContent = <EmptyUsersList />;
      break;
    case !isSearchMode && isFetchingCurrent:
      listContent = <Loader />;
      break;
    case !isSearchMode && chats.length > 0:
      listContent = chats.map((chat) => (
        <UsersListItem key={chat.id} data={chat} onClickFunc={handleChatNavigate} />
      ));
      break;
    case !isSearchMode && !isFetchingCurrent && chats.length === 0:
      listContent = <EmptyChats />;
      break;
    default:
      listContent = null;
  }

  return (
    <Box className={cl.usersListWrapper}>
      {isError && (
        <Box color="error.main" textAlign="center">
          Ошибка загрузки {isSearchMode ? "пользователей" : "чатов"}.
        </Box>
      )}
      <List className={cl.userList}>{listContent}</List>
    </Box>
  );
};

export default React.memo(UsersList);
