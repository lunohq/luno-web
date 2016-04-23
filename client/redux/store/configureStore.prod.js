import { createStore } from 'redux';
import rootReducer from '../rootReducer'

export default function (initialState) {
  return createStore(
    rootReducer,
    initialState,
  );
}
