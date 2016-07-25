import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import keycode from 'keycode'

import FlatButton from 'material-ui/FlatButton'

import withStyles from 'u/withStyles'
import t from 'u/gettext'

import s from './form-style.scss'

export const FORM_NAME = 'form/explain'

class Form extends Component {

  handleKeyDown = (event) => {
    if (keycode(event) === 'enter') {
      this.props.handleSubmit(this.props.onSubmit)()
    }
  }

  render() {
    const { handleSubmit, onSubmit } = this.props
    return (
      <div>
        <section>
          <Field
            autoComplete='off'
            component={TextField}
            floatingLabelFixed
            floatingLabelText={t('Reply ID')}
            fullWidth
            hintText={t('Reply ID to run the query against')}
            name='replyId'
          />
          <Field
            autoComplete='off'
            component={TextField}
            floatingLabelFixed
            floatingLabelText={t('Query')}
            fullWidth
            hintText={t('Query to run against the reply')}
            name='query'
            onKeyDown={this.handleKeyDown}
          />
        </section>
        <section>
          <FlatButton
            label={t('Submit')}
            onTouchTap={handleSubmit(onSubmit)}
            primary
          />
        </section>
      </div>
    )
  }

}

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
})(withStyles(s)(Form))
