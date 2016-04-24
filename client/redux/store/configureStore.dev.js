import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import rootReducer from '../rootReducer'
import DevTools from '../../components/DevTools'

export default function (initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(createLogger()),
      DevTools.instrument()
    ),
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../rootReducer', () => {
      const nextRootReducer = require('../rootReducer').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
