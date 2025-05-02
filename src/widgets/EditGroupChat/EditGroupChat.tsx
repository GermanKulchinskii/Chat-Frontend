import { Box, Button } from "@mui/material";
import cl from "./EditGroupChat.module.scss";
import { Member } from "@/store/Chat/chatTypes";
import { useCallback, useState } from "react";
import GroupChatName from "../GroupChatName/GroupChatName";
import { useAppDispatch } from "@/store/store";
import { searchActions } from "@/store/Search";
import SearchUsers from "../SearchUsers/SearchUsers";
import GroupSearchUserList from "../GroupSearchUserList/GroupSearchUserList";
import useDeleteChat from "@/hooks/useDeleteChat";

interface EditGroupChatProps {
  chatName: string;
  chatMembers: Member[];
  chatId: number;
  isAdmin: boolean;
}

const EditGroupChat = (props: EditGroupChatProps) => {
  const { chatName, chatId, chatMembers } = props;
  const [localChatName, setLocalChatName] = useState<string>(chatName);
  const dispatch = useAppDispatch();

  const { deleteChatHandler, isLoading: isDeleting, error: deleteError } = useDeleteChat(chatId);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const onSearchDebounced = useCallback((value: string) => {
    setDebouncedSearch(value);
    dispatch(searchActions.setGroupChatSearchQuery(value));
  }, [dispatch]);

  return (
    <Box className={cl.modalWrapper}>
      <GroupChatName name={localChatName} setName={setLocalChatName} />
      <SearchUsers onSearchDebounced={onSearchDebounced} />
      <GroupSearchUserList search={debouncedSearch} />

      <Box className={cl.submitWrapper}>
        <Button className={cl.delete} onClick={deleteChatHandler}>Удалить чат</Button>
        <Button className={cl.submit} onClick={saveChat}>Сохранить</Button>
      </Box>
    </Box>
  );
}

export default EditGroupChat;
