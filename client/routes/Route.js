import React from 'react';
import { Route } from 'react-router';

import ViewerQueries from '../queries/Viewer';

import AppContainer from '../components/App/Container';

export default (
  <Route path='/' component={AppContainer} queries={ViewerQueries} />
);

