import React, { PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import t from 'u/gettext'

import TextField from 'material-ui/TextField'

export const FORM_NAME = 'form/answers/answer'

const validate = values => {
  const errors = {}
  if (!values.title) {
    errors.title = t('Required')
  } else if (values.title && values.title.split(' ').length > 15) {
    errors.title = t('Maximum of 15 words')
  }
  if (!values.body) {
    errors.body = t('Required')
  }
  return errors
}

const Title = (props) => (
  <TextField
    errorText={props.touched ? props.error : undefined}
    fullWidth
    hintText={t('Title')}
    {...props}
  />
)

Title.propTypes = {
  error: PropTypes.string,
  touched: PropTypes.bool,
}

const Body = (props) => (
  <TextField
    errorText={props.touched ? props.error : undefined}
    fullWidth
    hintText={t('Answer')}
    multiLine
    rows={1}
    {...props}
  />
)

Body.propTypes = {
  error: PropTypes.string,
  touched: PropTypes.bool,
}

const Form = () => (
  <div>
    <Field name='title' component={Title} />
    <Field name='body' component={Body} />
  </div>
)

export default reduxForm({
  form: FORM_NAME,
  validate,
})(Form)
