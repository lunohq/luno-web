import React, { PropTypes } from 'react'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './summary-style.scss'

const Summary = ({ query, maxScore, took, totalResults, ...other }) => (
  <section {...other}>
    <div className={s.container}>
      <span>{t(`Total Results: ${ totalResults }`)}</span><br />
      <span>{t(`Max Score: ${maxScore}`)}</span><br />
      <span>{t(`Took: ${took}ms`)}</span>
    </div>
  </section>
)

Summary.propTypes = {
  query: PropTypes.string.isRequired,
  maxScore: PropTypes.number.isRequired,
  took: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
}

export default withStyles(s)(Summary)
