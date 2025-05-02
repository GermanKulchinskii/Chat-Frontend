import { Box, Button } from '@mui/material';
import cl from './DeleteChatModal.module.scss';
import useDeleteChat from '@/hooks/useDeleteChat';

type DeleteChatModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DeleteChatModal = (props: DeleteChatModalProps) => {
  const { isOpen, setIsOpen } = props;
  const chatId = Number(window.location.pathname.split('/').at(-1)?.slice(3) || 0);

  const { deleteChatHandler, isLoading } = useDeleteChat(chatId);

  const closeModal = () => {
    setIsOpen(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Box className={cl.modal}>
      <Box className={cl.modalContent}>
        <h2>Удалить чат?</h2>
        <Box className={cl.buttons}>
          <Button className={cl.cancelBtn} onClick={closeModal}>Отмена</Button>
          <Button className={cl.deleteBtn} onClick={deleteChatHandler} color='error' loading={isLoading}>Удалить</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default DeleteChatModal;
