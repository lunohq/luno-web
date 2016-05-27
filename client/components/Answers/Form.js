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

const Form = () => {
  return (
    <form>
      <div>
        <Field name='title' component={title =>
            <TextField
              errorText={title.touched ? title.error : undefined}
              fullWidth
              hintText={t('Title')}
              {...title}
            />
          }
        />
        <Field name='body' component={body =>
            <TextField
              errorText={body.touched ? body.error : undefined}
              fullWidth
              hintText={t('Answer')}
              multiLine
              rows={1}
              {...body}
            />
          }
        />
      </div>
    </form>
  )
}

export default reduxForm({
  form: FORM_NAME,
  validate,
})(Form)
