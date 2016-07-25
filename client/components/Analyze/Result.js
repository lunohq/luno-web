import React, { PropTypes } from 'react'

import withStyles from 'u/withStyles'

import s from './result-style.scss'

const Result = ({ result: { result }, ...other }) => (
  <section {...other}>
    <div className={s.row}>
      <pre className={s.result}>
        {result}
      </pre>
    </div>
  </section>
)

Result.propTypes = {
  result: PropTypes.object.isRequired,
}

export default withStyles(s)(Result)

