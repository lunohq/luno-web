import React from 'react'

import withStyles from 'u/withStyles'

import s from './style.scss'

const Divider = () => (
  <hr className={s.divider} />
)

export default withStyles(s)(Divider)
