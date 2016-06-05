import React from 'react'
import { Field, reduxForm } from 'redux-form'
import t from 'u/gettext'

import TextField from 'material-ui/TextField'

export const FORM_NAME = 'form/answers/answer'

const validate = values => {
  const errors = {}
  if (!values.title) {
    errors.title = 'Required'
  } else if (values.title && values.title.split(' ').length > 15) {
    errors.title = 'Maximum of 15 words'
  }
  if (!values.body) {
    errors.body = 'Required'
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

const Form = () => {
  return (
    <form>
      <div>
        <Field name='title' component={Title} />
        <Field name='body' component={Body} />
      </div>
    </form>
  )
}

export default reduxForm({
  form: FORM_NAME,
  validate,
})(Form)
