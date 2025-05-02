import React, { useEffect } from "react";
import { Box, List } from "@mui/material";
import { useFindUsersQuery } from "@/services/searchUsersApi";
import { useCurrentQuery } from "@/services/authApi";
import cl from "./UsersList.module.scss";
import EmptyChats from "@/shared/EmptyChats/EmptyChats";
import EmptyUsersList from "@/shared/EmptyUsersList/EmptyUsersList";
import UsersListItem from "@/shared/UsersListItem/UsersListItem";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/store";
import { authActions } from "@/store/Auth";
import { chatActions } from "@/store/Chat";
import Loader from "@/shared/Loader/Loader";
import { Chat, PrivateChat } from "@/services/types";

interface User {
  id: number;
  username: string;
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


  const handleChatNavigate = (data: Chat | PrivateChat | User) => {
    if ("username" in data) {
      dispatch(
        chatActions.setChatInfo({
          chatId: data.id,
          chatName: data.username,
          secondUserId: data.id,
          secondUserName: data.username,
        })
      );
      navigate(`/chat/100${data.id}`);
    }
    else if ("chatmembers" in data && "sequentialNumber" in data) {
        dispatch(
          chatActions.setChatInfo({
            chatId: data.id,
            chatName: data.name,
            secondUserId: undefined,
            secondUserName: undefined,
          })
        );
        navigate(`/chat/200${data.sequentialNumber}`);
    } else {
      const interlocutor = data.chatmembers.find(member => member.id !== currentData?.data.current.id);
      if (interlocutor) {
        dispatch(
          chatActions.setChatInfo({
            chatId: data.id,
            chatName: interlocutor.username,
            secondUserId: interlocutor.id,
            secondUserName: interlocutor.username,
          })
        );
        navigate(`/chat/100${interlocutor.id}`);
      }
    }
  };

  const users: User[] = isSearchMode
    ? findUsersData?.data?.findUsers || []
    : [];

  let chats: Chat[] | PrivateChat[] = [];
  if (!isSearchMode && currentData?.data?.current) {
    const { privateChats, chats: groupChats } = currentData.data.current;
    chats = [...(privateChats || []), ...(groupChats || [])];
  }

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
