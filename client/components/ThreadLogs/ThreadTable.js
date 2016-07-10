import React, { PropTypes } from 'react'

import {
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table'

import t from 'u/gettext'

import Table from 'c/Table/Component'
import ThreadRow from './ThreadRow'

const ThreadTable = ({ threadEdges, onViewMore }) => {
  const threadRows = threadEdges.map(({ node }, index) => (
    <ThreadRow
      onViewMore={onViewMore}
      key={index}
      thread={node}
    />
  ))
  return (
    <Table selectable={false}>
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>{t('TIME')}</TableHeaderColumn>
          <TableHeaderColumn>{t('USER')}</TableHeaderColumn>
          <TableHeaderColumn>{t('CHANNEL')}</TableHeaderColumn>
          <TableHeaderColumn>{t('MESSAGE')}</TableHeaderColumn>
          <TableHeaderColumn />
        </TableRow>
      </TableHeader>
      <TableBody
        deselectOnClickaway
        displayRowCheckbox={false}
        showRowHover
      >
        {threadRows}
      </TableBody>
    </Table>
  )
}

ThreadTable.propTypes = {
  onViewMore: PropTypes.func.isRequired,
  threadEdges: PropTypes.array.isRequired,
}

export default ThreadTable
