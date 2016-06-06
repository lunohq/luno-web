import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'

import RoleField from './RoleField'

export const FORM_NAME = 'form/users/edit'

const EditForm = ({ user }) => (
  <div>
    <RoleField name='role' defaultSelected={user.role || '0'} />
  </div>
)

EditForm.propTypes = {
  user: PropTypes.object.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
})(EditForm)
