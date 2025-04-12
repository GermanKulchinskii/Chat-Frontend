import { Button, TextField } from '@mui/material';
import cl from './MessageInput.module.scss';
import SendIcon from '@/assets/send_message.svg?react';
import React from 'react';

interface MessageInputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const MessageInput = (props: MessageInputProps) => {
  const { value, setValue, onSubmit } = props;

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit();
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() !== '') {
        handleSubmit();
      }
    }
  };

  return (
    <div className={cl.wrapper}>
      <TextField 
        label="Сообщение"
        variant="outlined"
        id="search"
        className={cl.input}
        minRows={1}
        maxRows={10}
        multiline
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleEnter}
        sx={{
          textArea: {
            width: '87%'
          },
          input: {
            color: 'white',
            fontSize: '1.25rem',
          },
          '& .MuiInputBase-input': {
            color: 'white',
            fontSize: '1.25rem',
            whiteSpace: 'pre-wrap',
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
      <Button className={cl.btn} onClick={handleSubmit}>
        <SendIcon className={cl.icon} />
      </Button>
    </div>
  );
};

export default React.memo(MessageInput);