import { useSelector } from 'react-redux';
import { usernameSelector } from '@/store/Auth/selector';
import { Chat } from '@/widgets/UsersList/UsersList';

interface ChatOrUser {
  username?: string | undefined;
  name?: string | undefined;
  isGroup?: boolean;
}

const isChat = (data: ChatOrUser): data is Chat => {
  return 'name' in data && typeof data.name === 'string';
};

const getChatDisplayName = (chatName: string, currentUserName?: string): string => {
  const matches = chatName.match(/Чат между (\S+) и (\S+)/);
  if (matches) {
    const [, name1, name2] = matches;
    return name1 === currentUserName ? name2 : name1;
  }
  return "Чат";
};

export const useChatDisplayName = (data: ChatOrUser): string => {
  const currentUserName = useSelector(usernameSelector);
  
  if ('username' in data && data.username) {
    return data.username;
  }
  
  if (isChat(data)) {
    return data.isGroup ? data.name : getChatDisplayName(data.name, currentUserName);
  }

  return "Чат";
};
