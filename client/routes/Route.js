import React from 'react';
import { IndexRoute, Route } from 'react-router';

import ViewerQueries from '../queries/Viewer';

import AppContainer from '../components/App/Container';
import AnswersContainer from '../components/Answers/Container';

export default (
  <Route path='/' component={AppContainer} queries={ViewerQueries}>
    <IndexRoute component={AppContainer} queries={ViewerQueries} />
    <Route path='/answers' component={AnswersContainer} queries={ViewerQueries} />
  </Route>
);

