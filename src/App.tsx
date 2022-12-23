import React from 'react';
import { ReduxWrapper } from './store';
import Routes from './routes';
import NotificationComponent from 'components/Notification';
import { ThemeManager } from 'theme';


const App: React.FC = () => {
  return (
    <ReduxWrapper>
      <ThemeManager>
        <Routes />
        <NotificationComponent />
      </ThemeManager>
    </ReduxWrapper>
  );
}

export default App;
