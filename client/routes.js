import React from 'react'
import { IndexRedirect, Route, IndexRoute } from 'react-router'

import ViewerQueries from './queries/Viewer'

import AppContainer from 'c/App/Container'
import KnowledgeContainer from 'c/Knowledge/Container'
import AdminContainer from 'c/Admin/Container'
import ThreadLogsContainer from 'c/ThreadLogs/Container'
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
    {/* Support backwards compatability with loading from topic-less replies */}
    <Route
      path='knowledge/:topicId'
      component={KnowledgeContainer}
      queries={ViewerQueries}
      render={({ props }) => props ? <KnowledgeContainer {...props} /> : <Loading /> }
    />
    <Route
      path='knowledge/:topicId/:replyId'
      component={KnowledgeContainer}
      queries={ViewerQueries}
      render={({ props }) => props ? <KnowledgeContainer {...props} /> : <Loading /> }
    />
    <Route
      path='admin/:slug'
      component={AdminContainer}
      queries={ViewerQueries}
      render={({ props }) => props ? <AdminContainer {...props} /> : <Loading />}
    />
    <Route path='logs'>
      <IndexRoute
        component={ThreadLogsContainer}
        queries={ViewerQueries}
        render={({ props }) => props ? <ThreadLogsContainer {...props} /> : <Loading />}
        prepareParams={params => ({ ...params, hasThread: false })}
      />
      <Route
        path=':threadId'
        component={ThreadLogsContainer}
        queries={ViewerQueries}
        prepareParams={params => ({ ...params, hasThread: true })}
      />
    </Route>
  </Route>
)
/* eslint-enable react/prop-types */
