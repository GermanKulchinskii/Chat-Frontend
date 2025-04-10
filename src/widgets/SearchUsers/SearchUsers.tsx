import { TextField } from '@mui/material';
import cl from './SearchUsers.module.scss';

interface SearchUsersProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchUsers = (props: SearchUsersProps) => {
  const { search, setSearch } = props;

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
            fontSize: '1.35rem',
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

export default SearchUsers;
