import React, { Component, PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import DocumentTitle from 'c/DocumentTitle'
import Divider from 'c/Divider/Component'
import SectionTitle from 'c/SectionTitle/Component'

import InviteDialog from './InviteDialog'
import UsersTable from './UsersTable'
import s from './style.scss'

class ManageUsers extends Component {

  state = {
    inviteOpen: false,
  }

  displayInviteForm = () => this.setState({ inviteOpen: true })
  hideInviteForm = () => this.setState({ inviteOpen: false })
  handleSubmitInvite = (values) => {
    debugger
    this.hideInviteForm()
  }

  handleEdit = (user) => {}
  handleDelete = (user) => {}

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
            onDelete={this.handleDelete}
            onEdit={this.handleEdit}
            users={users}
          />
          <InviteDialog
            members={members}
            open={this.state.inviteOpen}
            onSubmit={this.handleSubmitInvite}
            onCancel={this.hideInviteForm}
          />
        </div>
      </DocumentTitle>
    )
  }

}

ManageUsers.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(ManageUsers)
