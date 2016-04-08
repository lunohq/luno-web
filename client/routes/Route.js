import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import ViewerQuery from './ViewerQuery';

import AppContainer from '../components/App/AppContainer';
import FeatureContainer from '../components/Feature/FeatureContainer';
import LoginComponent from '../components/Login/LoginComponent';
import MessageLogComponent from '../components/MessageLog/MessageLogComponent';
import SignupComponent from '../components/Signup/SignupComponent';
import SmartAnswerComponent from '../components/SmartAnswer/SmartAnswerComponent';

export default (
  <Route path='/' component={AppContainer} queries={ViewerQuery}>
    <IndexRoute component={FeatureContainer} queries={ViewerQuery} />
    <Route path='/signup' component={SignupComponent} />
    <Route path='/login' component={LoginComponent} />
    <Route path='/message-logs' component={MessageLogComponent} />
    <Route path='/smart-answers' component={SmartAnswerComponent} />
    <Redirect from='*' to='/' />
  </Route>
);

