import React from 'react'
import Relay from 'react-relay'
import { IndexRoute, Route } from 'react-router'

import ViewerQueries from './queries/Viewer'

import AppContainer from 'c/App/Container'
import AnswersContainer from 'c/Answers/Container'
import AdminContainer from 'c/Admin/Container'
import Loading from 'c/Loading'

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
      path='/admin/:slug'
      component={AdminContainer}
      queries={ViewerQueries}
      render={({ props }) => props ? <AdminContainer {...props} /> : <Loading />}
    />
  </Route>
)

