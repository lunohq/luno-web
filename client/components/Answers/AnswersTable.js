import React, { PropTypes } from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui';

import AnswerRow from './AnswerRow';

const AnswersTable = ({ bot, handleDelete, handleEdit }) => {
  const answerRows = bot.answers.edges.map(({ node }, index) => <AnswerRow
    answer={node}
    handleDelete={handleDelete}
    handleEdit={handleEdit}
    key={index}
  />);
  return (
    <Table
      fixedFooter
      fixedHeader
      selectable={false}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>Title</TableHeaderColumn>
          <TableHeaderColumn>Smart Answer</TableHeaderColumn>
          <TableHeaderColumn>Topics</TableHeaderColumn>
          <TableHeaderColumn />
        </TableRow>
      </TableHeader>
      <TableBody
        deselectOnClickaway
        displayRowCheckbox={false}
        showRowHover
      >
        {answerRows}
      </TableBody>
    </Table>
  );
};

AnswersTable.propTypes = {
  bot: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default AnswersTable;
