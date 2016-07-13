import React from 'react'
import { Table as MaterialTable } from 'material-ui/Table'

import withStyles from 'u/withStyles'

import s from './style.scss'

const Table = (props) => (
  <div className={s.root}>
    <MaterialTable {...props} />
  </div>
)

export default withStyles(s)(Table)
