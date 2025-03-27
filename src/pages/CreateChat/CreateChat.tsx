import Header from "@/widgets/Header/Header";
import cl from './CreateChat.module.scss';
import SearchUsers from "@/widgets/SearchUsers/SearchUsers";
import { useEffect, useState } from "react";
import GroupChatName from "@/widgets/GroupChatName/GroupChatName";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import useDebounce from "@/hooks/useDebounce";
import { groupChatSearchQuery } from "@/store/Search/selectors";
import { searchActions } from "@/store/Search";
import GroupSearchUserList from "@/widgets/GroupSearchUserList/GroupSearchUserList";

const CreateChat = () => {
  const dispatch = useAppDispatch();
  const storedSearch = useSelector(groupChatSearchQuery);

  const [name, setName] = useState("");
  const [search, setSearch] = useState(storedSearch || "");

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    dispatch(searchActions.setGroupChatSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  return (
    <>
      <Header />
      <section className={cl.content}>
        <GroupChatName name={name} setName={setName} />
        <SearchUsers search={search} setSearch={setSearch} />
        <GroupSearchUserList search={debouncedSearch} />
      </section>
    </>
  );
}

export default CreateChat;
