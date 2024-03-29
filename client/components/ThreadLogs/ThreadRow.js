import React, { PropTypes } from 'react'

import IconButton from 'material-ui/IconButton'
import VisibilityIcon from 'material-ui/svg-icons/action/visibility'
import { TableRow, TableRowColumn } from 'material-ui/Table'

import moment from 'u/moment'
import colors from 's/colors'

import ActionsRowColumn from 'c/ActionsRowColumn'

const ThreadRow = ({ thread, onViewMore }) => (
  <TableRow>
    <TableRowColumn>{moment(thread.created).format('MMMM Do YYYY, h:mm a')}</TableRowColumn>
    <TableRowColumn>{`@${thread.username}`}</TableRowColumn>
    <TableRowColumn>{thread.channelName}</TableRowColumn>
    <TableRowColumn>{thread.message}</TableRowColumn>
    <ActionsRowColumn>
      <IconButton onTouchTap={() => onViewMore(thread) }>
        <VisibilityIcon color={colors.darkGrey} />
      </IconButton>
    </ActionsRowColumn>
  </TableRow>
)

ThreadRow.propTypes = {
  onViewMore: PropTypes.func.isRequired,
  thread: PropTypes.object.isRequired,
}

export default ThreadRow
