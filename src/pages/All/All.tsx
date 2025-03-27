import SearchUsers from '@/widgets/SearchUsers/SearchUsers';
import UsersList from '@/widgets/UsersList/UsersList';
import { useState } from 'react';
import Header from '@/widgets/Header/Header';
import useDebounce from '@/hooks/useDebounce';

const All = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  return (
    <>
      <Header />
      <SearchUsers search={search} setSearch={setSearch} />
      <UsersList search={debouncedSearch} />
    </>
  );
}

export default All;
