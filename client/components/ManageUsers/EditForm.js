import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'

import RoleField from './RoleField'

export const FORM_NAME = 'form/users/edit'

const EditForm = ({ initialValues }) => (
  <div>
    <RoleField name='role' defaultSelected={initialValues.role} />
  </div>
)

EditForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
})(EditForm)
