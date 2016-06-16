import { browserHistory } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import Raven from 'raven-js'

import Root from 'c/Root'
import configureStore from './redux/store/configureStore'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', { credentials: 'same-origin' }),
)
/* eslint-disable no-undef */
if (__ENABLE_SENTRY__) {
  Raven.config(__SENTRY_DSN__).install()
}
/* eslint-enable no-undef */

const store = configureStore()
const rootNode = document.getElementById('app')

ReactDOM.render(<Root history={browserHistory} store={store} />, rootNode)
injectTapEventPlugin()
