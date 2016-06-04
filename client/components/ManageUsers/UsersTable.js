import React, { PropTypes } from 'react'

import {
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table'

import t from 'u/gettext'

import Table from 'c/Table/Component'
import UserRow from './UserRow'

const UsersTable = ({ users, onDelete, onEdit }) => {
  const userRows = users.map(({ node }, index) => (
    <UserRow
      onDelete={onDelete}
      onEdit={onEdit}
      key={index}
      user={node}
    />
  ))
  return (
    <Table selectable={false}>
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>{t('USERNAME')}</TableHeaderColumn>
          <TableHeaderColumn>{t('PERMISSIONS')}</TableHeaderColumn>
          <TableHeaderColumn />
        </TableRow>
      </TableHeader>
      <TableBody
        deselectOnClickaway
        displayRowCheckbox={false}
        showRowHover
      >
        {userRows}
      </TableBody>
    </Table>
  )
}

UsersTable.propTypes = {
  users: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
}

export default UsersTable
