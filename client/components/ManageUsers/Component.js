import React, { Component, PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import DocumentTitle from 'c/DocumentTitle'
import Divider from 'c/Divider/Component'
import SectionTitle from 'c/SectionTitle/Component'

import DeleteDialog from './DeleteDialog'
import EditDialog from './EditDialog'
import InviteDialog from './InviteDialog'
import UsersTable from './UsersTable'
import s from './style.scss'

class ManageUsers extends Component {

  state = {
    deleteFormOpen: false,
    inviteFormOpen: false,
    editFormOpen: false,
    userToEdit: null,
    userToDelete: null,
  }

  displayInviteForm = () => this.setState({ inviteFormOpen: true })
  hideInviteForm = () => this.setState({ inviteFormOpen: false })
  handleSubmitInvite = (values) => {
    debugger
    this.hideInviteForm()
  }

  displayEditForm = (user) => this.setState({
    userToEdit: user,
    editFormOpen: true,
  })
  hideEditForm = () => this.setState({
    editFormOpen: false,
    userToEdit: null,
  })
  handleSubmitEdit = (values) => {
    debugger
    this.hideEditForm()
  }

  displayDeleteConfirmation = (user) => this.setState({
    deleteFormOpen: true,
    userToDelete: user,
  })
  hideDeleteConfirmation = () => this.setState({
    deleteFormOpen: false,
    userToDelete: null,
  })
  handleDelete = () => {
    debugger
    this.hideDeleteConfirmation()
  }

  render() {
    // "members" should be the diff between members and users, you can't invite someone who is already a user, unless they're a consumer?
    const { viewer: { team: { members: { edges: members }, users: { edges: users } } } } = this.props
    return (
      <DocumentTitle title={t('Manage Users')}>
        <div className={s.content}>
          <div className={s.title}>
            <SectionTitle title={t('Manage Users')} />
            <RaisedButton
              label={t('Invite')}
              onTouchTap={this.displayInviteForm}
              primary
            />
            <Divider />
          </div>
          <UsersTable
            onDelete={this.displayDeleteConfirmation}
            onEdit={this.displayEditForm}
            users={users}
          />
          <InviteDialog
            members={members}
            open={this.state.inviteFormOpen}
            onSubmit={this.handleSubmitInvite}
            onCancel={this.hideInviteForm}
          />
          {(() => !this.state.userToEdit ? null : (
            <EditDialog
              open={this.state.editFormOpen}
              user={this.state.userToEdit}
              onSubmit={this.handleSubmitEdit}
              onCancel={this.hideEditForm}
            />
          ))()}
          {(() => !this.state.userToDelete ? null : (
            <DeleteDialog
              open={this.state.deleteFormOpen}
              user={this.state.userToDelete}
              onCancel={this.hideDeleteConfirmation}
              onConfirm={this.handleDelete}
            />
          ))()}
        </div>
      </DocumentTitle>
    )
  }

}

ManageUsers.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(ManageUsers)
