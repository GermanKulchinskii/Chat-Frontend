import Header from '@/widgets/Header/Header';
import SearchContainer from '@/widgets/SearchContainer/SearchContainer';
import cl from './All.module.scss';

const All = () => {
  return (
    <main className={cl.main}>
      <Header />
      <div></div>
      <SearchContainer />
    </main>
  );
};

export default All;
