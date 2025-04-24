import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ApolloWrapper } from './apollo/client.tsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import AppRoutes from './router/router.tsx';

import './styles/globals.scss';
import { Provider } from 'react-redux';
import { createReduxStore } from './store/store.ts';
import { ToastContainer } from 'react-toastify';

const store = createReduxStore();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloWrapper>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
            <AppRoutes />
            <ToastContainer />
        </ThemeProvider>
      </Provider>
    </ApolloWrapper>
  </StrictMode>
);
