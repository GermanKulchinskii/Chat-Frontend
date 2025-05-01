import { Box, CircularProgress } from '@mui/material';
import cl from './Loader.module.scss';

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" py={2} className={cl.loader}>
      <CircularProgress color="primary" className={cl.circle} />
    </Box>
  );
}

export default Loader;
