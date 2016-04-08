import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import AppComponent from '../components/App/AppComponent';
import FeatureComponent from '../components/Feature/FeatureComponent';
import LoginComponent from '../components/Login/LoginComponent';
import MessageLogComponent from '../components/MessageLog/MessageLogComponent';
import SignupComponent from '../components/Signup/SignupComponent';
import SmartAnswerComponent from '../components/SmartAnswer/SmartAnswerComponent';

export default (
  <Route path='/' component={AppComponent}>
    <IndexRoute component={FeatureComponent} />
    <Route path='/signup' component={SignupComponent} />
    <Route path='/login' component={LoginComponent} />
    <Route path='/message-logs' component={MessageLogComponent} />
    <Route path='/smart-answers' component={SmartAnswerComponent} />
    <Redirect from='*' to='/' />
  </Route>
);

