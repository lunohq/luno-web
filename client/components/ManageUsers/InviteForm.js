import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'

import t from 'u/gettext'
import AutoCompleteMembers, { createDataSource } from 'c/AutoCompleteMembers'

import RoleField from './RoleField'

export const FORM_NAME = 'form/users/invite'

const validate = values => {
  const errors = {}
  if (!values.member) {
    errors.member = t('Required')
  }
  return errors
}

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

Username.propTypes = {
  error: PropTypes.string,
  members: PropTypes.array.isRequired,
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
})(InviteForm)
