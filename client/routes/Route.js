import React from 'react';
import { IndexRoute, Route } from 'react-router';

import ViewerQuery from '../queries/Viewer';

import AppContainer from '../components/App/Container';
import SmartAnswerContainer from '../components/SmartAnswer/Container';

import MessageLogComponent from '../components/MessageLog/MessageLogComponent';

export default (
  <Route path='/' component={AppContainer} queries={ViewerQuery}>
    <IndexRoute component={AppContainer} queries={ViewerQuery} />
    <Route path='/message-logs' component={MessageLogComponent} />
    <Route path='/smart-answers' component={SmartAnswerContainer} queries={ViewerQuery} />
  </Route>
);

