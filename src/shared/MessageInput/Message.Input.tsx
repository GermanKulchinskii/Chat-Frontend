import React, { useState, useCallback } from 'react';
import { Button, TextField } from '@mui/material';
import cl from './MessageInput.module.scss';
import SendIcon from '@/assets/send_message.svg?react';

interface MessageInputProps {
  onSubmit: (value: string) => void;
}

const MessageInput = React.memo(({ onSubmit }: MessageInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(() => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  }, [value, onSubmit]);

  const handleEnter = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSubmit();
      }
    }
  }, [value, handleSubmit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <div className={cl.wrapper}>
      <TextField 
        size='medium'
        label="Сообщение"
        variant="outlined"
        id="search"
        className={cl.input}
        minRows={1}
        maxRows={10}
        multiline
        value={value}
        onChange={handleChange}
        onKeyDown={handleEnter}
        sx={{
          textArea: { width: '87%' },
          input: { color: 'white', fontSize: '1.25rem' },
          '& .MuiInputBase-input': { 
            color: 'white',
            fontSize: '1.25rem',
            whiteSpace: 'pre-wrap',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: 'white' },
            '&.Mui-focused fieldset': { borderColor: 'white' },
          },
          '& .MuiInputLabel-root': { color: 'white' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
        }}
      />
      <Button className={cl.btn} onClick={handleSubmit}>
        <SendIcon className={cl.icon} />
      </Button>
    </div>
  );
});

export default MessageInput;
