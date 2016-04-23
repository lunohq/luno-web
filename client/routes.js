import React from 'react';
import { IndexRoute, Route } from 'react-router';

import ViewerQueries from './queries/Viewer';

import AppContainer from './components/App/Container';
import AnswersContainer from './components/Answers/Container';
import BotSettingsContainer from './components/BotSettings/Container';

export default (
  <Route path='/' component={AppContainer} queries={ViewerQueries}>
    <IndexRoute component={AnswersContainer} queries={ViewerQueries} />
    <Route path='/bot-settings' component={BotSettingsContainer} queries={ViewerQueries} />
  </Route>
);

