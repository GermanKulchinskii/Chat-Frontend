import { TextField } from '@mui/material';
import cl from './SearchUsers.module.scss';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import React from 'react';

interface SearchUsersProps {
  onSearchDebounced: (search: string) => void;
}

const SearchUsers = (props: SearchUsersProps) => {
  const { onSearchDebounced } = props;

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    onSearchDebounced(debouncedSearch);
  }, [debouncedSearch, onSearchDebounced]);

  return (
    <div className={cl.searchWrapper}>
      <TextField
        label="Имя пользователя"
        variant="outlined"
        id="search"
        className={cl.input}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          input: {
            color: 'white',
            width: '100%',
            height: '1.25rem'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'white',
          },
        }}
      />
    </div>
  );
};

export default React.memo(SearchUsers);
