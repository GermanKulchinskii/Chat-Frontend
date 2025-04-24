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

const CreateChat = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const onSearchDebounced = useCallback((value: string) => {
    setDebouncedSearch(value);
    dispatch(searchActions.setGroupChatSearchQuery(value));
  }, [dispatch]);

  const addedUsers = useSelector(selectedUsers);

  const [startGroupChat, { data, isLoading, error }] = useStartGroupChatMutation();

  useEffect(() => {
    if (data) {
      navigate(`/chat/${data.data.startGroupChat.id}`);
    }
  }, [navigate, data]);

  useEffect(() => {
    if (error) {
      toast.error("Ошибка создания чата");
    }
  }, [error]);

  const createChat = () => {
    if (addedUsers.length < 2) {
      toast.error("Просто напиши ему?");
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

  return (
    <div className={cl.wrapper}>
      <Header />
      <section className={cl.content}>
        <GroupChatName name={name} setName={setName} />
        <SearchUsers onSearchDebounced={onSearchDebounced} />
        <GroupSearchUserList search={debouncedSearch} />
        <Box className={cl.submitWrapper}>
          <Button className={cl.submit} onClick={createChat}>Создать чат</Button>
        </Box>
      </section>
    </div>
  );
};

export default CreateChat;
