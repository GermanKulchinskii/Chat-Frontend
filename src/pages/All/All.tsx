import Header from '@/widgets/Header/Header';
import SearchContainer from '@/widgets/SearchContainer/SearchContainer';
import cl from './All.module.scss';

const All = () => {
  console.log("All.tsx rendered");

  return (
    <main className={cl.main}>
      <Header />
      <SearchContainer />
    </main>
  );
};

export default All;
