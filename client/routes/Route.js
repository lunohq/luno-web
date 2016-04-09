import React from 'react';
import { Route, Redirect } from 'react-router';

import SmartAnswersQuery from '../queries/SmartAnswers';
import ViewerQuery from '../queries/Viewer';

import AppContainer from '../components/App/Container';
import SmartAnswerContainer from '../components/SmartAnswer/Container';

import MessageLogComponent from '../components/MessageLog/MessageLogComponent';

export default (
  <Route path='/' component={AppContainer} queries={ViewerQuery}>
    <Route path='/message-logs' component={MessageLogComponent} />
    <Route path='/smart-answers' component={SmartAnswerContainer} queries={ViewerQuery} />
    <Redirect from='*' to='/' />
  </Route>
);

