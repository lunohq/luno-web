import React, { PropTypes } from 'react'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import Result from './Result'

import s from './results-style.scss'

const Results = ({ totalResults, requestTook, results, ...other }) => {
  const items = results.map((result, index) => <Result key={index} {...result} />)
  return (
    <section {...other}>
      <section className={s.summary}>
        <span>{t(`Total Results: ${totalResults}`)}</span><br />
        <span>{t(`Request Took: ${requestTook}ms`)}</span><br />
      </section>
      <section className={s.items}>
        {items}
      </section>
    </section>
  )
}

Results.propTypes = {
  requestTook: PropTypes.number.isRequired,
  results: PropTypes.array.isRequired,
  totalResults: PropTypes.number.isRequired,
}

export default withStyles(s)(Results)
