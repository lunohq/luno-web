import React, { Component, PropTypes } from 'react'
import { TextField } from 'material-ui'
import { Field, reduxForm } from 'redux-form'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import Divider from 'c/Divider/Component'
import SectionTitle from 'c/SectionTitle/Component'

import s from './expertise-style.scss'

const FORM_NAME = 'form/bot-settings/expertise'

const validate = values => {
  const errors = {}
  if (!values.purpose || !values.purpose.trim()) {
    errors.purpose = t('required')
  }
  return errors
}

class Expertise extends Component {

  componentWillMount() {
    const { bot: { purpose }, initialize } = this.props
    if (purpose) {
      initialize({ purpose })
    }
  }

  render() {
    const { bot, onSave, handleSubmit } = this.props
    return (
      <div>
        <div>
          <div className={s.titleContainer}>
            <SectionTitle title={t('Lunobot Expertise')} />
          </div>
          <Divider />
          <p className={s.text}>
              {t('What kinds of questions can your Lunobot answer (e.g. HR)? This information will be used in introduction and help messages to set expectations on what your Lunobot can and cannot answer.')}
          </p>
        </div>
        <div className={s.body}>&ldquo;{t('I can answer basic questions related to')}
          <Field name='purpose' component={purpose => {
            const { onBlur, ...other } = purpose

            function handleBlur(event) {
              onBlur(event)
              handleSubmit(onSave)()
            }

            function handleKeyDown(event) {
              if (event.key === 'Enter') {
                handleSubmit(onSave)()
              }
            }

            return (
              <TextField
                className={s.expertise}
                errorText={purpose.touched && purpose.error}
                hintText={t('E.g., travel or HR and benefits')}
                multiLine={false}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                {...other}
              />
            )
          }} />&rdquo;
        </div>
      </div>
    )
  }

}

Expertise.propTypes = {
  bot: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
  validate,
})(withStyles(s)(Expertise))
