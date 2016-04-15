import React, { PropTypes } from 'react';
import Relay from 'react-relay';

import AnonymousLanding from '../AnonymousLanding2/Component';
import AuthenticatedLanding from '../AuthenticatedLanding/Component';
import LogoutMutation from '../../mutations/LogoutMutation';

const App = ({ children, viewer }) => {
  function handleLogout() {
    Relay.Store.commitUpdate(
      new LogoutMutation({ viewer })
    );
  }

  if (viewer.anonymous) {
    return <AnonymousLanding />;
  }
  return (
    <AuthenticatedLanding
      children={children}
      onLogout={handleLogout}
    />
  );
};

App.propTypes = {
  children: PropTypes.object,
  viewer: PropTypes.object.isRequired,
};

export default App;
