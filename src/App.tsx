import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { ReduxWrapper } from './redux';
import Routes from './routes';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ReduxWrapper>
        <ThemeProvider theme={theme}>
          <Routes />
        </ThemeProvider>
    </ReduxWrapper>
  );
}

export default App;
