import SearchUsers from '@/widgets/SearchUsers/SearchUsers';
import UsersList from '@/widgets/UsersList/UsersList';
import { useEffect, useState } from 'react';
import Header from '@/widgets/Header/Header';
import useDebounce from '@/hooks/useDebounce';
import { useAppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import { searchQuery } from '@/store/Search/selectors';
import { searchActions } from '@/store/Search';

const All = () => {
  const dispatch = useAppDispatch();
  const storedSearch = useSelector(searchQuery);

  const [search, setSearch] = useState(storedSearch || "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    dispatch(searchActions.setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  return (
    <>
      <Header />
      <SearchUsers search={search} setSearch={setSearch} />
      <UsersList search={debouncedSearch} />
    </>
  );
}

export default All;
