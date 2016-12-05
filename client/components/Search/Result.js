import React, { PropTypes } from 'react'
import { Card, CardHeader, CardText } from 'material-ui/Card'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './result-style.scss'

const Result = ({ body, explanation, displayTitle, score, title }) => {
  const content = (
    <div className={s.bodyContainer}>
      <span className={s.title}>
        {t(`Indexed title: ${title}`)}
      </span>
      <br />
      <br />
      <span className={s.body}>
        {body}
      </span>
    </div>
  )
  return (
    <Card>
      <CardHeader
        title={`${displayTitle} (${score})`}
        subtitle={content}
        actAsExpander
        showExpandableButton
      />
      <CardText expandable>
        <pre className={s.explanation}>
          {explanation}
        </pre>
      </CardText>
    </Card>
  )
}

Result.propTypes = {
  body: PropTypes.string.isRequired,
  displayTitle: PropTypes.string.isRequired,
  explanation: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}

export default withStyles(s)(Result)
