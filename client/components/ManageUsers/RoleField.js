import React, { PropTypes } from 'react'
import { Field } from 'redux-form'

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

import t from 'u/gettext'

const RoleField = (props) => (
  <Field
    component={RadioButtonGroup}
    {...props}
  >
    <RadioButton value='ADMIN' label={t('Superadmin')} />
    <RadioButton value='TRAINER' label={t('Bot Trainer')} />
  </Field>
)

export default RoleField
