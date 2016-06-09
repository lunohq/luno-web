import React, { PropTypes } from 'react'
import { Field } from 'redux-form'

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './role-field-style.scss'

const Label = ({ primaryText, secondaryText }) => (
  <div>
    <p>{primaryText}</p>
    {(() => !secondaryText ? null : (
      <p className={s.secondaryText}>{secondaryText}</p>
    ))()}
  </div>
)

Label.propTypes = {
  primaryText: PropTypes.string.isRequired,
}

const RoleField = (props) => (
  <Field
    component={RadioButtonGroup}
    {...props}
  >
    <RadioButton
      className={s.button}
      value='ADMIN'
      label={
        <Label
          primaryText={t('Superadmin')}
          secondaryText={t('Superadmins have full control over your Luno account.')}
        />
      }
    />
    <RadioButton
      className={s.button}
      value='TRAINER'
      label={
        <Label
          primaryText={t('Bot Trainer')}
          secondaryText={t('Bot trainers can train bots but do not have access to admin settings.')}
        />
      }
    />
  </Field>
)

export default withStyles(s)(RoleField)
