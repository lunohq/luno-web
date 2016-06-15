import React from 'react'
import { IndexRedirect, Route } from 'react-router'

import ViewerQueries from './queries/Viewer'

import AppContainer from 'c/App/Container'
import KnowledgeContainer from 'c/Knowledge/Container'
import AdminContainer from 'c/Admin/Container'
import Loading from 'c/Loading'

/* eslint-disable react/prop-types */
export default (
  <Route
    path='/'
    component={AppContainer}
    queries={ViewerQueries}
  >
    <IndexRedirect to='/knowledge' />
    <Route
      path='knowledge'
      component={KnowledgeContainer}
      queries={ViewerQueries}
      render={({ props }) => props ? <KnowledgeContainer {...props} /> : <Loading />}
    />
    <Route
      path='admin/:slug'
      component={AdminContainer}
      queries={ViewerQueries}
      render={({ props }) => props ? <AdminContainer {...props} /> : <Loading />}
    />
  </Route>
)
/* eslint-enable react/prop-types */
