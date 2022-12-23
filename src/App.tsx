import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { ReduxWrapper } from './store';
import Routes from './routes';
import NotificationComponent from 'components/Notification';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ReduxWrapper>
      <ThemeProvider theme={theme}>
        <Routes />
        <NotificationComponent />
      </ThemeProvider>
    </ReduxWrapper>
  );
}

export default App;
