import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AnonymousLanding from '../AnonymousLanding/Component';
import AuthenticatedLanding from '../AuthenticatedLanding/Component';
import LogoutMutation from '../../mutations/LogoutMutation';

const App = ({ children, viewer }) => {
  function handleLogout() {
    Relay.Store.commitUpdate(
      new LogoutMutation({ viewer })
    );
  }

  let main;
  if (viewer.anonymous) {
    main = <AnonymousLanding />;
  } else {
    main = (
      <AuthenticatedLanding
        children={children}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      {main}
    </MuiThemeProvider>
  );
};

App.propTypes = {
  children: PropTypes.object,
  viewer: PropTypes.object.isRequired,
};

export default App;
