import React, { PropTypes } from 'react';

import './style.scss';

import AnonymousLanding from '../AnonymousLanding/Component';
import AuthenticatedLanding from '../AuthenticatedLanding/Component';

const App = ({ children, viewer }) => {
  // TODO: Check whether user is authenticated or not
  if (window.location.pathname === '/') {
    return <AnonymousLanding />;
  }

  return <AuthenticatedLanding children={children} viewer={viewer} />;
};

App.propTypes = {
  children: PropTypes.object,
  viewer: PropTypes.object.isRequired,
};

export default App;
