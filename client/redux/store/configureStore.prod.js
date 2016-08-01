import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import mutationMiddleware from '../middleware/mutationMiddleware'
import rootReducer from '../rootReducer'

export default function (initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, mutationMiddleware),
  )
}
