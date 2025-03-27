import SearchUsers from '@/widgets/SearchUsers/SearchUsers';
import cl from './All.module.scss'
import UsersList from '@/widgets/UsersList/UsersList';
import { useState } from 'react';
import Header from '@/widgets/Header/Header';
import useDebounce from '@/hooks/useDebounce';

const All = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  return (
    <div className={cl.bg}>
      <div className={cl.content}>
        <Header />
        <SearchUsers search={search} setSearch={setSearch} />
        <UsersList search={debouncedSearch} />
      </div>
    </div>
  );
}

export default All;
