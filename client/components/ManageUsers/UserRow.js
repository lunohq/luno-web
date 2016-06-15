import React, { PropTypes } from 'react'

import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import { TableRow, TableRowColumn } from 'material-ui/Table'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import colors from 's/colors'

import ActionsRowColumn from 'c/ActionsRowColumn'

import s from './user-row-style.scss'

const UserRow = ({ user, onDelete, onEdit }, { viewer: { id: userId } }) => {
  let actions = []
  if (userId !== user.id) {
    actions = [
      <IconButton key='edit' onTouchTap={() => onEdit(user)}>
        <FontIcon className='material-icons' color={colors.darkGrey}>edit</FontIcon>
      </IconButton>,
      <IconButton key='delete' onTouchTap={() => onDelete(user)}>
        <FontIcon className='material-icons' color={colors.darkGrey}>delete</FontIcon>
      </IconButton>
    ]
  }

  let viewerLabel = ''
  if (userId === user.id) {
    viewerLabel = t(' (you)')
  }

  return (
    <TableRow>
      <TableRowColumn>{`@${user.username}${viewerLabel}`}</TableRowColumn>
      <TableRowColumn>{user.displayRole}</TableRowColumn>
      <ActionsRowColumn>
        {actions}
      </ActionsRowColumn>
    </TableRow>
  )
}

UserRow.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

UserRow.contextTypes = {
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(UserRow)
