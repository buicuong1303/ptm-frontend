import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { store } from 'store';
import routes from 'routes';
import { renderRoutes } from 'react-router-config';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { ScrollReset, SnackbarWrapper } from 'components';
import theme from './theme';
import './index.scss';
import { SocketChatProvider } from 'services/socket/SocketChat';
import { SocketNotificationProvider } from 'services/socket/SocketNotification';
import { PermissionProvider } from 'contexts/PermissionProvider';
import { SettingProvider } from 'contexts/SettingProvider';

function App() {
  return (
    <StoreProvider store={store}>
      <SnackbarWrapper>
        <Router>
          <SettingProvider>
            <SocketNotificationProvider>
              <SocketChatProvider>
                <ThemeProvider theme={theme}>
                  <ScrollReset />
                  <PermissionProvider>
                    {renderRoutes(routes)}
                  </PermissionProvider>
                </ThemeProvider>
              </SocketChatProvider>
            </SocketNotificationProvider>
          </SettingProvider>
        </Router>
      </SnackbarWrapper>
    </StoreProvider>
  );
}

export default App;
