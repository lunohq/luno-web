import React, { PropTypes } from 'react'

import {
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui'

import Table from 'c/Table/Component'
import AnswerRow from './AnswerRow'

const AnswersTable = ({ bot, handleDelete, handleEdit }) => {
  const answerRows = bot.answers.edges.map(({ node }, index) => <AnswerRow
    answer={node}
    handleDelete={handleDelete}
    handleEdit={handleEdit}
    key={index}
  />)
  return (
    <Table
      selectable={false}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>Title</TableHeaderColumn>
          <TableHeaderColumn>Smart Answer</TableHeaderColumn>
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
  )
}

AnswersTable.propTypes = {
  bot: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
}

export default AnswersTable
