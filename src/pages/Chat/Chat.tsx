import { useCurrentQuery } from '@/services/authApi';
import { useStartOrGetPrivateChatMutation } from '@/services/chatApi';
import { authActions } from '@/store/Auth';
import { userIdSelector, usernameSelector } from '@/store/Auth/selector';
import { chatActions } from '@/store/Chat';
import { chatIdSelector, chatNameSelector, secondUserIdSelector, secondUserNameSelector } from '@/store/Chat/selectors';
import { useAppDispatch } from '@/store/store';
import Header from '@/widgets/Header/Header';
import PrivateChat from '@/widgets/PrivateChat/PrivateChat';
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Chats = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  console.log("Chat.tsx");

  // Инфа о чате
  const chatId = useSelector(chatIdSelector);
  const chatName = useSelector(chatNameSelector);
  const secondUserName = useSelector(secondUserNameSelector) || "Чат";
  const secondUserId = useSelector(secondUserIdSelector) || Number(location.pathname.split('/').at(-1));

  // Инфа о текущем юзере
  const username = useSelector(usernameSelector);
  const userId = useSelector(userIdSelector);

  // Получение текущего пользователя (если его ещё нет)
  const {
    data: currentData,
    isFetching: isFetchingCurrent,
    isError: isErrorCurrent,
  } = useCurrentQuery(undefined, 
    { 
      skip: !!userId,
      refetchOnMountOrArgChange: true,
    });

  useEffect(() => {
    if (currentData && currentData.data && currentData.data.current) {
      const currentUser = currentData.data.current;
      dispatch(authActions.setUserInfo({
        username: currentUser.username,
        userId: currentUser.id,
      }));
    }
  }, [currentData, dispatch]);

  const [startOrGetPrivateChat, { data, isError, isLoading }] = useStartOrGetPrivateChatMutation();

  useEffect(() => {
    if (username && userId) {
      startOrGetPrivateChat({ secondUserId: secondUserId });
    }
  }, [username, userId, startOrGetPrivateChat, secondUserId]);
  
  const getChatDisplayName = (chatName: string, currentUserName: string | undefined) => {
    const matches = chatName.match(/Чат между (\S+) и (\S+)/);
    if (matches) {
      const [, name1, name2] = matches;
      return name1 === currentUserName ? name2 : name1;
    }
    return "чат";
  };

  useEffect(() => {
    if (data?.data?.startOrGetPrivateChat) {
      const chatData = data.data.startOrGetPrivateChat;
      dispatch(chatActions.setChatId({ chatId: chatData.id }));
      dispatch(chatActions.setChatName({ chatName: chatData.name }));

      dispatch(chatActions.setChatInfo({ secondUserName: getChatDisplayName(chatData.name, username) }))
    }
  }, [data, dispatch]);

  const loadingUser = !userId && isFetchingCurrent;
  const errorUser = !userId && isErrorCurrent;

  return (
    <>
      <Header />
      {loadingUser ? (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress />
        </Box>
      ) : errorUser ? (
        <Box color="error.main">Ошибка загрузки текущего пользователя.</Box>
      ) : (
        <PrivateChat
          chatName={chatName}
          secondUserName={secondUserName || chatName}
          secondUserId={secondUserId}
          chatId={chatId!}
          currentUserName={username}
          currentUserId={userId!}
          isError={isErrorCurrent || isError}
          isFetching={isFetchingCurrent || isLoading}
          initialMessages={data?.data?.startOrGetPrivateChat?.messages || []}
        />
      )}
    </>
  );
}

export default Chats;
