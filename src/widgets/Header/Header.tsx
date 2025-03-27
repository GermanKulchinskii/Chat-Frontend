import { Link, useNavigate } from 'react-router-dom';
import cl from './Header.module.scss';
import { Button } from '@mui/material';
import LogoutIcon from '@/assets/logout.svg?react';
import CreateChatIcon from '@/assets/group_chat.svg?react'
import { useCallback } from 'react';
import { useAppDispatch } from '@/store/store';
import { authActions } from '@/store/Auth';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(authActions.logout());
    navigate('/login');
  }, []);

  return (
    <header className={cl.header}>
      <Link to={'/create_chat'}>
        <Button className={cl.exitBtn} >
          <CreateChatIcon />
        </Button>
      </Link>
      <Button className={cl.exitBtn} onClick={logout}>
        <LogoutIcon />
      </Button>
    </header>
  );
}

export default Header;
