import React from 'react'
import CircularProgress from 'material-ui/CircularProgress'

import withStyles from '../../utils/withStyles'

import s from './style.scss'

const Loading = () => (
  <div className={s.root}>
    <CircularProgress />
  </div>
)

export default withStyles(s)(Loading)
