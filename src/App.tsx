import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { ApiProviderWrapper, ReduxWrapper } from './redux';
import Routes from './routes';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ReduxWrapper>
      <ApiProviderWrapper>
        <ThemeProvider theme={theme}>
          <Routes />
        </ThemeProvider>
      </ApiProviderWrapper>
    </ReduxWrapper>
  );
}

export default App;
