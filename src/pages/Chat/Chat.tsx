import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useGetChatQuery } from '@/services/chatApi';
import { chatActions } from '@/store/Chat';
import { secondUserNameSelector } from '@/store/Chat/selectors';
import { useAppDispatch } from '@/store/store';
import Header from '@/widgets/Header/Header';
import PrivateChat from '@/widgets/PrivateChat/PrivateChat';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import cl from './Chat.module.scss';
import { toast } from 'react-toastify';
import { useLazyFindUserByIdQuery } from '@/services/userApi';

export const CHAT_INITIAL_MESSAGES = 20;

const Chats = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, username, isFetching: isFetchingCurrent, isError: isErrorCurrent } = useCurrentUser();

  const idFromUrl = location.pathname.split('/').at(-1) || "";
  const isUserId = idFromUrl.startsWith("100");
  const isChatId = idFromUrl.startsWith("200");

  const chatId = idFromUrl.slice(3);

  const { data, isError, isLoading, isFetching, error } = useGetChatQuery(
    { chatId: idFromUrl, offset: 0, limit: CHAT_INITIAL_MESSAGES },
    { skip: !idFromUrl, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (isChatId && (isError || data?.errors)) {
      toast.error('Ошибка загрузки чата.');
    }
  }, [isChatId, isError, data]);

  useEffect(() => {
    if (data?.data?.getChat) {
      const chatData = data.data.getChat;
      dispatch(chatActions.setChatId({ chatId: chatData.id }));
      dispatch(chatActions.setChatName({ chatName: chatData.name }));
      dispatch(chatActions.setChatInfo({ members: chatData.members }));
    }
  }, [data, dispatch]);

  const [isFindingUser, setIsFindingUser] = useState(false);

  const [
    triggerFindUser,
    { data: userData, isError: isErrorFindUser, isLoading: isLoadingFindUser, isFetching: isFetchingFindUser }
  ] = useLazyFindUserByIdQuery();

  useEffect(() => {
    if (isUserId && data?.errors?.length) {
      const errorMessages = data?.errors[0]?.message || "";
      if (errorMessages.includes(`There's no chat between users ${userId} and ${chatId}`)) {
        setIsFindingUser(true);
        triggerFindUser({ userId: Number(chatId) })
          .unwrap()
          .finally(() => setIsFindingUser(false));
      } else {
        toast.error('Ошибка загрузки чата.');
      }
    }
  }, [isUserId, data, isError, error, chatId, userId, triggerFindUser]);

  useEffect(() => {
    if (isUserId && isErrorFindUser) {
      navigate('/all');
    }
  }, [isUserId, isErrorFindUser, navigate]);

  const loading =
    isFetchingCurrent ||
    isLoading ||
    isFetching ||
    (isUserId && (isLoadingFindUser || isFetchingFindUser || isFindingUser));

  const chatExists = data?.data?.getChat;
  const initialMessages = chatExists ? chatExists.messages : [];

  let secondUserNameToUse = useSelector(secondUserNameSelector);
  if (isUserId && userData?.data?.findUserById) {
    secondUserNameToUse = userData.data.findUserById.username;
  }
  const secondUserIdToUse = Number(idFromUrl);

  const errorUser =
    (!userId && isErrorCurrent) ||
    (isChatId && isError) ||
    (isUserId && isError && !userData);

  const noChat = isUserId && !chatExists && !!(userData?.data?.findUserById);

  const content = errorUser ? (
    <Box color="error.main">Ошибка загрузки чата.</Box>
  ) : (
    <PrivateChat
      secondUserId={secondUserIdToUse}
      chatId={idFromUrl}
      currentUserName={username}
      currentUserId={userId!}
      isError={isErrorCurrent || isError || (isUserId && isErrorFindUser)}
      isFetching={loading}
      initialMessages={initialMessages}
      noChat={noChat}
      chatName={data?.data?.getChat?.name || userData?.data.findUserById.username || "Чат"}
    />
  );

  return (
    <main className={cl.main}>
      <Header />
      {content}
    </main>
  );
};

export default Chats;
