import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useGetChatQuery } from '@/services/chatApi';
import { chatActions } from '@/store/Chat';
import { chatIdSelector, chatNameSelector, secondUserIdSelector, secondUserNameSelector } from '@/store/Chat/selectors';
import { useAppDispatch } from '@/store/store';
import Header from '@/widgets/Header/Header';
import PrivateChat from '@/widgets/PrivateChat/PrivateChat';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import cl from './Chat.module.scss';
import { toast } from 'react-toastify';

export const CHAT_INITIAL_MESSAGES = 20;

const Chats = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const chatId = Number(location.pathname.split('/').at(-1));
  const secondUserName = useSelector(secondUserNameSelector);
  const secondUserId = useSelector(secondUserIdSelector) || Number(location.pathname.split('/').at(-1));

  const { userId, username, isFetching: isFetchingCurrent, isError: isErrorCurrent } = useCurrentUser();

  const { data, isError, isLoading, isFetching } = useGetChatQuery(
    { chatId: chatId!, offset: 0, limit: CHAT_INITIAL_MESSAGES },
    { 
      skip: !chatId,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (!isLoading && (isError)) {
      toast.error('Ошибка загрузки чата.');
      navigate('/');
    }
  }, [isLoading, isError, data, navigate]);

  useEffect(() => {
    if (data?.data?.getChat) {
      const chatData = data.data.getChat;
      dispatch(chatActions.setChatId({ chatId: chatData.id }));
      dispatch(chatActions.setChatName({ chatName: chatData.name }));
    }
  }, [data, dispatch]);

  const errorUser = !userId && isErrorCurrent || isError;

  let content;

  if (errorUser) {
    content = <Box color="error.main">Ошибка загрузки текущего пользователя.</Box>;
  } else {
    content = (
      <PrivateChat
        secondUserName={secondUserName}
        secondUserId={secondUserId}
        chatId={chatId!}
        currentUserName={username}
        currentUserId={userId!}
        isError={isErrorCurrent || isError}
        isFetching={isFetchingCurrent || isLoading || isFetching}
        initialMessages={data?.data?.getChat?.messages || []}
        isGroup={data?.data?.getChat?.isGroup || false}
      />
    );
  }

  return (
    <main className={cl.main}>
      <Header />
      {content}
    </main>
  );
};

export default Chats;