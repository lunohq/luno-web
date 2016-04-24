import { browserHistory } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'

import Root from './components/Root'
import configureStore from './redux/store/configureStore'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', { credentials: 'same-origin' }),
)

const store = configureStore()
const rootNode = document.createElement('div')
document.body.appendChild(rootNode)

ReactDOM.render(<Root history={browserHistory} store={store} />, rootNode)
injectTapEventPlugin()
