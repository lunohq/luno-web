import React, { PropTypes } from 'react'
import {
  FontIcon,
  IconButton,
  TableRow,
  TableRowColumn,
} from 'material-ui'

import withStyles from 'u/withStyles'
import colors from 's/colors'

import ActionsRowColumn from 'c/ActionsRowColumn'

import s from './answer-row-style.scss'

const AnswerRow = ({ answer, handleDelete, handleEdit }) => {
  const cellStyle = { fontSize: '1.4rem', whiteSpace: 'pre-wrap' }

  const editAnswer = (answerToEdit) => {
    handleEdit(answerToEdit)
  }

  const deleteAnswer = (answerToDelete) => {
    handleDelete(answerToDelete)
  }

  const { id, title, body } = answer
  return (
    <TableRow data-id={id}>
      <TableRowColumn style={cellStyle}>{title}</TableRowColumn>
      <TableRowColumn style={cellStyle}>{body}</TableRowColumn>
      <ActionsRowColumn>
        <IconButton
          onTouchTap={() => editAnswer(answer)}
        >
          <FontIcon className='material-icons' color={colors.darkGrey}>edit</FontIcon>
        </IconButton>
        <IconButton
          onTouchTap={() => deleteAnswer(answer)}
        >
          <FontIcon className='material-icons' color={colors.darkGrey}>delete</FontIcon>
        </IconButton>
      </ActionsRowColumn>
    </TableRow>
  )
}

AnswerRow.propTypes = {
  answer: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
}

export default withStyles(s)(AnswerRow)
