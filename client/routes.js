import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ViewerQueries from './queries/Viewer'

import AppContainer from 'c/App/Container'
import KnowledgeContainer from 'c/Knowledge/Container'
import AdminContainer from 'c/Admin/Container'
import ThreadLogsContainer from 'c/ThreadLogs/Container'
import Loading from 'c/Loading'

function prepareThreadLogsParams(pre, { location: { state } }) {
  const params = pre
  if (state && state.threadLogs) {
    params.threadLogs = state.threadLogs
  }
  return params
}

/* eslint-disable react/prop-types */
export default (
  <Route
    path='/'
    component={AppContainer}
    queries={ViewerQueries}
  >
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
        prepareParams={(params, props) => prepareThreadLogsParams({ ...params, hasThread: false }, props)}
      />
      <Route
        path=':threadId'
        component={ThreadLogsContainer}
        queries={ViewerQueries}
        prepareParams={(params, props) => prepareThreadLogsParams({ ...params, hasThread: true }, props)}
      />
    </Route>
    { /* /signin and /sadface are empty components we're using only to display a URL.
     *
     * The routing logic lives within App because relay and react-router don't
     * handle this well (can't get state within onEnter).
     */ }
    <Route path='signin' component={() => <div />} />
    <Route path='sadface' component={() => <div />} />
  </Route>
)
/* eslint-enable react/prop-types */
