import { useDeleteChatMutation } from "@/services/chatApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useDeleteChat = (chatId: number) => {
  const [deleteChat, { error, isLoading, isSuccess }] = useDeleteChatMutation();
  const navigate = useNavigate();

  const deleteChatHandler = async () => {
    try {
      await deleteChat({ chatId }).unwrap();
      toast.success("Чат удалён");
      navigate("/all");
    } catch (err) {
      toast.error("Ошибка удаления чата");
    }
  };

  return { deleteChatHandler, error, isLoading, isSuccess };
}

export default useDeleteChat;