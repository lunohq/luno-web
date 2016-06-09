import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import RaisedButton from 'material-ui/RaisedButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import DeleteUserMutation from 'm/DeleteUserMutation'
import InviteUserMutation from 'm/InviteUserMutation'
import UpdateUserMutation from 'm/UpdateUserMutation'

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
  handleSubmitInvite = ({ member, role }) => {
    const mutation = new InviteUserMutation({ member, role, teamId: this.props.viewer.team.id })
    Relay.Store.commitUpdate(mutation)
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
  handleSubmitEdit = ({ role }) => {
    const mutation = new UpdateUserMutation({ user: this.state.userToEdit, role })
    Relay.Store.commitUpdate(mutation)
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
    const mutation = new DeleteUserMutation({ user: this.state.userToDelete, teamId: this.props.viewer.team.id })
    Relay.Store.commitUpdate(mutation)
    this.hideDeleteConfirmation()
  }

  render() {
    const { viewer: { team: { members: { edges: members }, staff: { edges: users } } } } = this.props
    const staffUserIds = users.map(({ node: { id } }) => id)
    const invitable = []
    for (const member of members) {
      const { node: { userId } } = member
      if (!staffUserIds.includes(userId)) {
        invitable.push(member)
      }
    }
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
            members={invitable}
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
