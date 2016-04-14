import React, { PropTypes } from 'react';
import {
  FlatButton,
  TableRow,
  TableRowColumn,
} from 'material-ui';

const AnswerRow = ({ answer, handleDelete, handleEdit }) => {
  const cellStyle = { fontSize: '1.4em', whiteSpace: 'pre-wrap' };

  const editAnswer = (answerToEdit) => {
    handleEdit(answerToEdit);
  };

  const deleteAnswer = (answerToDelete) => {
    handleDelete(answerToDelete);
  };

  const { id, title, body } = answer;
  return (
    <TableRow key={id}>
      <TableRowColumn style={cellStyle}>{title}</TableRowColumn>
      <TableRowColumn style={cellStyle}>{body}</TableRowColumn>
      <TableRowColumn>
        <FlatButton
          label='Edit'
          onTouchTap={() => editAnswer(answer)}
        />
        <FlatButton
          label='Delete'
          onTouchTap={() => deleteAnswer(answer)}
        />
      </TableRowColumn>
    </TableRow>
  );
};

AnswerRow.propTypes = {
  answer: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default AnswerRow;
