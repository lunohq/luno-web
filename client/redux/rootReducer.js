import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import files from './modules/files'

export default combineReducers({
  form,
  files,
})
