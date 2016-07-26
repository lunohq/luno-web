import React, { PropTypes } from 'react'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './summary-style.scss'

const Summary = ({ maxScore, took, requestTook, totalResults, ...other }) => (
  <section {...other}>
    <div className={s.container}>
      <span>{t(`Total Results: ${totalResults}`)}</span><br />
      <span>{t(`Max Score: ${maxScore}`)}</span><br />
      <span>{t(`ES Took: ${took}ms`)}</span><br />
      <span>{t(`Request Took: ${requestTook}ms`)}</span>
    </div>
  </section>
)

Summary.propTypes = {
  maxScore: PropTypes.number.isRequired,
  requestTook: PropTypes.number.isRequired,
  took: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
}

export default withStyles(s)(Summary)
