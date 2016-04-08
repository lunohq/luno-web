import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import { RelayRouter } from 'react-router-relay';

import '../node_modules/react-mdl/extra/material.js';
import Route from './routes/Route';

const rootNode = document.createElement('div');
document.body.appendChild(rootNode);

ReactDOM.render(
  <RelayRouter history={browserHistory} routes={Route} />,
  rootNode
);

injectTapEventPlugin();
