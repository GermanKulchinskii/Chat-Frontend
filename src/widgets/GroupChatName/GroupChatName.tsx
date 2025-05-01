import { TextField } from '@mui/material';
import cl from './GroupChatName.module.scss';

interface GroupChatNameProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const GroupChatName = (props: GroupChatNameProps) => {
  const { name, setName } = props;

  return (
    <div className={cl.searchWrapper}>
      <TextField
        label="Название чата"
        variant="outlined"
        id="name"
        className={cl.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
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
}

export default GroupChatName;
