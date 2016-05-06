import React, { Component, PropTypes } from 'react'
import { TextField } from 'material-ui'
import { Field, reduxForm } from 'redux-form'

import t from '../../utils/gettext'
import withStyles from '../../utils/withStyles'

import Divider from '../Divider/Component'
import SectionTitle from '../SectionTitle/Component'

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
            <SectionTitle title={t('Domain Expertise')} />
          </div>
          <Divider />
          <p className={s.text}>
              {t('What kinds of questions can your Lunobot answer (e.g. HR)? This information will be used in introduction and help messages to set expectations on what your Lunobot can and cannot answer.')}
          </p>
        </div>
        <div className={s.body}>&ldquo;{t('I can answer basic questions related to')}
          <Field name='purpose' component={purpose => {
            const { onBlur, ...other } = purpose

            // TODO: don't check for purpose value once this is resolved:
            // https://github.com/erikras/redux-form/issues/921
            function handleBlur(event) {
              onBlur(event)
              if (purpose.value && purpose.value.trim()) {
                handleSubmit(onSave)()
              }
            }

            function handleKeyDown(event) {
              if (purpose.value && purpose.value.trim() && event.key === 'Enter') {
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
