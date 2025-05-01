import React, { useCallback, useState } from 'react';
import SearchUsers from '@/widgets/SearchUsers/SearchUsers';
import UsersList from '@/widgets/UsersList/UsersList';
import { useAppDispatch } from '@/store/store';
import { searchActions } from '@/store/Search';

const SearchContainer = () => {
  const dispatch = useAppDispatch();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const onSearchDebounced = useCallback((value: string) => {
    setDebouncedSearch(value);
    dispatch(searchActions.setSearchQuery(value));
  }, [dispatch]);

  return (
    <>
      <SearchUsers onSearchDebounced={onSearchDebounced} />
      <UsersList search={debouncedSearch} />
    </>
  );
};

export default React.memo(SearchContainer);
