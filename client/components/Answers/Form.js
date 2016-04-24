import React from 'react';
import { Field, reduxForm } from 'redux-form';
import t from '../../utils/gettext';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export const FORM_NAME = 'form/answers/answer';

const validate = values => {
  const errors = {};
  if (!values.title) {
    errors.title = 'Required';
  }
  if (!values.body) {
    errors.body = 'Required';
  }
  return errors;
};

const Form = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props;

  return (
    <form>
      <div>
        <Field name='title' component={title => {
          return (<TextField
            errorText={title.touched ? title.error : undefined}
            fullWidth
            hintText={t('Title')}
            {...title}
          />)
          }
        }/>
        <Field name='body' component={body => {
          return (
          <TextField
            errorText={body.touched ? body.error : undefined}
            fullWidth
            hintText={t('Answer')}
            multiLine
            rows={1}
            {...body}
          />)
        }
        }/>
      </div>
    </form>
  );
};

export default reduxForm({
  form: FORM_NAME,
  validate,
})(Form);
