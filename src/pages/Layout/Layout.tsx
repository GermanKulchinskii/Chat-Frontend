import { Outlet } from 'react-router-dom';
import cl from './Layout.module.scss';

const Layout = () => {
  return (
    <div className={cl.bg}>
      <div className={cl.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
