import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import Relay from 'react-relay'
import { applyRouterMiddleware, Router } from 'react-router'
import useRelay from 'react-router-relay'

import routes from '../routes'
import DevTools from './DevTools'

const Root = ({ store, history }) => {
  return (
    <Provider store={store}>
      <div>
        <Router
          history={history}
          routes={routes}
          render={applyRouterMiddleware(useRelay)}
          environment={Relay.Store}
        />
        <DevTools />
      </div>
    </Provider>
  )
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

export default Root
