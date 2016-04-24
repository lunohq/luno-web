import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
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
        />
        <DevTools />
      </div>
    </Provider>
  )
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default Root
