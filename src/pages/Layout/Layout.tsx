import cl from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={cl.bg}>
      <div className={cl.content}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
