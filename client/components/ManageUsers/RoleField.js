import React, { PropTypes } from 'react'
import { Field } from 'redux-form'

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

import t from 'u/gettext'

const RoleField = (props) => (
  <Field
    component={RadioButtonGroup}
    {...props}
  >
    {/* TODO this should be moved to a luno-schema (maybe protobufs again?) repo that just contains our models and enums */}
    <RadioButton value='0' label={t('Superadmin')} />
    <RadioButton value='1' label={t('Bot Trainer')} />
  </Field>
)

export default RoleField
