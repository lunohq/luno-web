import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import useRelay from 'react-router-relay';
import Relay from 'react-relay';

import Route from './routes/Route';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', { credentials: 'same-origin' }),
);

const rootNode = document.createElement('div');
document.body.appendChild(rootNode);

ReactDOM.render((
  <Router
    history={browserHistory}
    routes={Route}
    render={applyRouterMiddleware(useRelay)}
  />
), rootNode);

injectTapEventPlugin();
