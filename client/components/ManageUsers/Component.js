import React, { Component, PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import DocumentTitle from 'c/DocumentTitle'
import Divider from 'c/Divider/Component'
import SectionTitle from 'c/SectionTitle/Component'

import UsersTable from './UsersTable'
import s from './style.scss'

class ManageUsers extends Component {

  handleInvite = () => {}
  handleEdit = (user) => {}
  handleDelete = (user) => {}

  render() {
    const { viewer: { team: { users: { edges: users } } } } = this.props
    return (
      <DocumentTitle title={t('Manage Users')}>
        <div className={s.content}>
          <div className={s.title}>
            <SectionTitle title={t('Manage Users')} />
            <RaisedButton
              label={t('Invite')}
              onTouchTap={this.handleInvite}
              primary
            />
            <Divider />
          </div>
          <UsersTable
            onDelete={this.handleDelete}
            onEdit={this.handleEdit}
            users={users}
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
