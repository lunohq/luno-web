import React from 'react'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './style.scss'

const NotFound = () => (
  <div className={s.root}>
    <h1 className={s.header}>{t('Oops! This page doesn\'t exist.')}</h1>
  </div>
)

export default withStyles(s)(NotFound)
