import React, { PropTypes } from 'react'

import withStyles from 'u/withStyles'
import s from './style.scss'

const SectionTitle = ({ title }) => (
  <h1 className={s.title}>{title}</h1>
)

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
}

export default withStyles(s)(SectionTitle)
