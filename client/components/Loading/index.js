import React, { PropTypes } from 'react'
import CircularProgress from 'material-ui/CircularProgress'

import withStyles from 'u/withStyles'

import s from './style.scss'

const Loading = ({ size }) => (
  <div className={s.root}>
    <CircularProgress size={size} />
  </div>
)

Loading.defaultProps = {
  size: 1,
}

Loading.propTypes = {
  size: PropTypes.number,
}

export default withStyles(s)(Loading)
