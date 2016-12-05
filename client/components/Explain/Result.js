import React, { PropTypes } from 'react'

import withStyles from 'u/withStyles'
import t from 'u/gettext'

import s from './result-style.scss'

const Result = ({ result, ...other }) => (
  <section {...other}>
    <div className={s.row}>
      <span className={s.text}>{t(`Matched: ${result.matched ? 'True' : 'False'}`)}</span>
    </div>
    <div className={s.row}>
      <pre className={s.explanation}>
        {result.explanation}
      </pre>
    </div>
  </section>
)

Result.propTypes = {
  result: PropTypes.object.isRequired,
}

export default withStyles(s)(Result)
