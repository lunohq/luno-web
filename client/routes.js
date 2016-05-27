import React from 'react'
import { IndexRoute, Route } from 'react-router'

import ViewerQueries from './queries/Viewer'

import AppContainer from './components/App/Container'
import AnswersContainer from './components/Answers/Container'
import BotSettingsContainer from './components/BotSettings/Container'
import Loading from './components/Loading'

export default (
  <Route
    path='/'
    component={AppContainer}
    queries={ViewerQueries}
  >
    <IndexRoute
      component={AnswersContainer}
      queries={ViewerQueries}
      render={({ props }) => props ? <AnswersContainer {...props} /> : <Loading />}
    />
    <Route
      path='/bot-settings'
      component={BotSettingsContainer}
      queries={ViewerQueries}
      render={({ props }) => props ? <BotSettingsContainer {...props} /> : <Loading />}
    />
  </Route>
)

