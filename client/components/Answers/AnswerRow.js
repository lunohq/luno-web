import React, { PropTypes } from 'react'
import {
  FontIcon,
  IconButton,
  TableRow,
  TableRowColumn,
} from 'material-ui'

const AnswerRow = ({ answer, handleDelete, handleEdit }) => {
  const cellStyle = { fontSize: '1.4rem', whiteSpace: 'pre-wrap' }
  const actionsCellStyle = { textAlign: 'right' }
  const actionsIconColor = '#757575'

  const editAnswer = (answerToEdit) => {
    handleEdit(answerToEdit)
  }

  const deleteAnswer = (answerToDelete) => {
    handleDelete(answerToDelete)
  }

  const { id, title, body } = answer
  return (
    <TableRow key={id}>
      <TableRowColumn style={cellStyle}>{title}</TableRowColumn>
      <TableRowColumn style={cellStyle}>{body}</TableRowColumn>
      <TableRowColumn style={actionsCellStyle}>
        <IconButton
          onTouchTap={() => editAnswer(answer)}
        >
          <FontIcon className='material-icons' color={actionsIconColor}>edit</FontIcon>
        </IconButton>
        <IconButton
          onTouchTap={() => deleteAnswer(answer)}
        >
          <FontIcon className='material-icons' color={actionsIconColor}>delete</FontIcon>
        </IconButton>
      </TableRowColumn>
    </TableRow>
  )
}

AnswerRow.propTypes = {
  answer: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
}

export default AnswerRow
