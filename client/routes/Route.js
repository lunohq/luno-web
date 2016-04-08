import React from 'react';
import { Route, Redirect } from 'react-router';

import AppComponent from '../components/App/AppComponent';
import MessageLogComponent from '../components/MessageLog/MessageLogComponent';
import SmartAnswerComponent from '../components/SmartAnswer/SmartAnswerComponent';

export default (
  <Route path='/' component={AppComponent}>
    <Route path='/message-logs' component={MessageLogComponent} />
    <Route path='/smart-answers' component={SmartAnswerComponent} />
    <Redirect from='*' to='/' />
  </Route>
);

