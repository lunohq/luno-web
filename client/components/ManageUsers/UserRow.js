import React, { PropTypes } from 'react'

import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import { TableRow, TableRowColumn } from 'material-ui/Table'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import colors from 's/colors'

import ActionsRowColumn from 'c/ActionsRowColumn'

import s from './user-row-style.scss'

const UserRow = ({ user, onDelete, onEdit }) => {
  return (
    <TableRow>
      <TableRowColumn>{`@${user.username}`}</TableRowColumn>
      <TableRowColumn>{user.displayRole}</TableRowColumn>
      <ActionsRowColumn>
        <IconButton onTouchTap={() => onEdit(user)}>
          <FontIcon className='material-icons' color={colors.darkGrey}>edit</FontIcon>
        </IconButton>
        <IconButton onTouchTap={() => onDelete(user)}>
          <FontIcon className='material-icons' color={colors.darkGrey}>delete</FontIcon>
        </IconButton>
      </ActionsRowColumn>
    </TableRow>
  )
}

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
}

export default withStyles(s)(UserRow)
