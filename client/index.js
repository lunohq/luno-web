import { browserHistory } from 'react-router';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { RelayRouter } from 'react-router-relay';

import '../node_modules/react-mdl/extra/material.js';
import Route from './routes/Route';

const reducers = {
  form: formReducer,
};
const reducer = combineReducers(reducers);
const store = createStore(reducer);
const rootNode = document.createElement('div');
document.body.appendChild(rootNode);

ReactDOM.render(
  <Provider store={store}>
    <RelayRouter history={browserHistory} routes={Route} />,
  </Provider>,
  rootNode
);

injectTapEventPlugin();
