import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import AutoCompleteMembers, { createDataSource } from 'c/AutoCompleteMembers'

import RoleField from './RoleField'

import s from './invite-form-style.scss'

export const FORM_NAME = 'form/users/invite'

const validate = values => {
  const errors = {}
  if (!values.member) {
    errors.member = t('Required')
  }
  return errors
}

/* eslint-disable no-unused-vars */
const Username = ({ members, onBlur, onChange, touched, error, ...other }) => {
  const dataSource = createDataSource(members)
  return (
    <AutoCompleteMembers
      dataSource={dataSource}
      errorText={touched && error}
      onNewRequest={(item, index) => {
        onChange(members[index].node)
      }}
      {...other}
    />
  )
}
/* eslint-enable no-unused-vars */

Username.propTypes = {
  error: PropTypes.string,
  members: PropTypes.array.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  touched: PropTypes.bool,
}

class InviteForm extends Component {

  state = {
    searchText: '',
  }

  handleUpdateInput = searchText => this.setState({ searchText })

  render() {
    const { initialValues, members } = this.props
    return (
      <div>
        <Field
          className={s.field}
          component={Username}
          members={members}
          name='member'
          onUpdateInput={this.handleUpdateInput}
          searchText={this.state.searchText}
        />
        <RoleField name='role' defaultSelected={initialValues.role} />
      </div>
    )
  }

}

InviteForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
  initialValues: {
    role: 'TRAINER',
  },
  validate,
})(withStyles(s)(InviteForm))
