import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField, SelectField } from 'redux-form-material-ui'
import keycode from 'keycode'

import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem'

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
          <Field component={SelectField} name='tier'>
            <MenuItem value={1} primaryText={t('Tier 1')} />
            <MenuItem value={2} primaryText={t('Tier 2')} />
            <MenuItem value={3} primaryText={t('Tier 3')} />
          </Field>
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
  initialValues: {
    tier: 1,
  },
})(withStyles(s)(Form))
