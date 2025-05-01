import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import cl from './MessageInput.module.scss';
import SendIcon from '@/assets/send_message.svg?react';

interface MessageInputProps {
  onSubmit: (value: string) => void;
}

const MessageInput = React.memo(({ onSubmit }: MessageInputProps) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSubmit = useCallback(() => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  }, [value, onSubmit]);

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim()) {
          handleSubmit();
        }
      }
    },
    [value, handleSubmit]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <div className={cl.wrapper}>
      <textarea
        id="search"
        ref={textareaRef}
        className={cl.input}
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleEnter}
        placeholder="Сообщение..."
      />
      <button type="button" className={cl.btn} onClick={handleSubmit}>
        <SendIcon className={cl.icon} />
      </button>
    </div>
  );
});

export default MessageInput;
