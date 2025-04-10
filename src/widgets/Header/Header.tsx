import { useLocation, useNavigate } from 'react-router-dom';
import cl from './Header.module.scss';
import { Button } from '@mui/material';
import LogoutIcon from '@/assets/logout.svg?react';
import CreateChatIcon from '@/assets/group_chat.svg?react';
import BackIcon from '@/assets/back.svg?react';
import { useCallback, useMemo } from 'react';
import { useAppDispatch } from '@/store/store';
import { authActions } from '@/store/Auth';
import { searchActions } from '@/store/Search';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(authActions.logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleBackButton = () => {
    dispatch(searchActions.setSelectedUsers([]));
    dispatch(searchActions.setGroupChatSearchQuery(""));
    navigate('/all');
  }

  const isCreateChatPage = location.pathname === '/create_chat' || location.pathname.startsWith('/chat');

  const leftIcon = useMemo(() => {
    if (isCreateChatPage) {
      return (
        <Button className={cl.backBtn} onClick={handleBackButton}>
          <BackIcon className={cl.icon} />
        </Button>
      );
    } else {
      return (
        <Button className={cl.createChatBtn} onClick={() => navigate('/create_chat')}>
          <CreateChatIcon className={cl.icon} />
        </Button>
      );
    }
  }, [isCreateChatPage, navigate]);

  const headerClassName = isCreateChatPage
    ? `${cl.header} ${cl.spaceBetween}`
    : cl.header;

  return (
    <header className={headerClassName}>
      {leftIcon}
      <Button className={cl.exitBtn} onClick={logout}>
        <LogoutIcon className={cl.icon} />
      </Button>
    </header>
  );
};

export default Header;
