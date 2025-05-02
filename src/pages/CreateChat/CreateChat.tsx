import Header from "@/widgets/Header/Header";
import cl from './CreateChat.module.scss';
import SearchUsers from "@/widgets/SearchUsers/SearchUsers";
import { useEffect, useState, useCallback } from "react";
import GroupChatName from "@/widgets/GroupChatName/GroupChatName";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { selectedUsers } from "@/store/Search/selectors";
import { searchActions } from "@/store/Search";
import GroupSearchUserList from "@/widgets/GroupSearchUserList/GroupSearchUserList";
import { Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import { useStartGroupChatMutation } from "@/services/chatApi";
import { useNavigate } from "react-router-dom";
import { useLazyCurrentQuery } from "@/services/authApi";
import Loader from "@/shared/Loader/Loader";

const CreateChat = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [createdChatId, setCreatedChatId] = useState<number | null>(null);

  const [triggerCurrentUser, { data: currentData, isFetching: isCurrentFetching }] = useLazyCurrentQuery();

  const onSearchDebounced = useCallback((value: string) => {
    setDebouncedSearch(value);
    dispatch(searchActions.setGroupChatSearchQuery(value));
  }, [dispatch]);

  const addedUsers = useSelector(selectedUsers);

  const [startGroupChat, { data, error }] = useStartGroupChatMutation();

  useEffect(() => {
    if (data?.data.startGroupChat) {
      setCreatedChatId(data.data.startGroupChat.id);
      triggerCurrentUser();
    }
  }, [data, triggerCurrentUser]);

  useEffect(() => {
    if (error) {
      toast.error("Ошибка создания чата");
    }
  }, [error]);

  useEffect(() => {
    if (createdChatId && currentData?.data?.current) {
      const groupChat = currentData.data.current.chats.find(chat => chat.id === createdChatId);
      if (groupChat) {
        navigate(`/chat/200${groupChat.sequentialNumber}`);
      }
    }
  }, [createdChatId, currentData, navigate]);

  const createChat = () => {
    if (!addedUsers.length) {
      toast.error("Но но но мистер фиш, ю кант толкин ту ерселф, ты же не тютю");
      return;
    }

    if (addedUsers.length > 6) {
      toast.error("А не много ли у тебя друзей?");
      return;
    }
    
    if (!name) {
      toast.error("И как ты потом этот чат найдешь?");
      return;
    }

    startGroupChat({ name, memberIds: addedUsers.map(user => user.id) });
  };

  const isCreating = createdChatId !== null || isCurrentFetching;

  return (
    <div className={cl.wrapper}>
      <Header />
      <section className={cl.content}>
        {isCreating ? (
          <Loader />
        ) : (
          <>
            <GroupChatName name={name} setName={setName} />
            <SearchUsers onSearchDebounced={onSearchDebounced} />
            <GroupSearchUserList search={debouncedSearch} />
            <Box className={cl.submitWrapper}>
              <Button className={cl.submit} onClick={createChat}>Создать чат</Button>
            </Box>
          </>
        )}
      </section>
    </div>
  );
};

export default CreateChat;
