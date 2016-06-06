import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'

import TextField from 'material-ui/TextField'

import t from 'u/gettext'
import AutoCompleteMembers, { createDataSource } from 'c/AutoCompleteMembers'

import RoleField from './RoleField'

export const FORM_NAME = 'form/users/invite'

const validate = values => {
  const errors = {}
  if (!values.user) {
    errors.user = t('Required')
  }
  return errors
}

const Username = ({ members, onNewRequest, onUpdateInput, searchText, onChange, touched, error }) => {
  const dataSource = createDataSource(members)
  return (
    <AutoCompleteMembers
      dataSource={dataSource}
      errorText={touched && error}
      onNewRequest={(item, index) => {
        onChange(members[index])
      }}
      onUpdateInput={onUpdateInput}
      searchText={searchText}
    />
  )
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
          name='user'
          onUpdateInput={this.handleUpdateInput}
          searchText={this.state.searchText}
        />
        <RoleField name='role' defaultSelected={initialValues.role} />
      </div>
    )
  }

}

InviteForm.propTypes = {
  members: PropTypes.array.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
  initialValues: {
    role: '1',
  },
  validate,
})(InviteForm)
