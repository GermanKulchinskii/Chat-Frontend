import NotFoundIcon from '@/assets/not_found.svg?react';
import cl from './NotFound.module.scss';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const NotFound = () => {
  return (
    <div className={cl.wrapper}>
      <NotFoundIcon className={cl.icon} />
      <Link to="/" className={cl.link}>
        <Button className={cl.button} variant='outlined'>
          На главную
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
