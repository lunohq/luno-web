import React, { PropTypes } from 'react'
import { Card, CardHeader, CardText } from 'material-ui/Card'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './result-style.scss'

const Result = ({ body, explanation, score, title, keywords, topic }) => {
  const content = (
    <div className={s.bodyContainer}>
      <span className={s.meta}>
        {t(`Topic: ${topic}`)}
      </span>
      <br />
      <span className={s.meta}>
        {t(`Keywords: ${keywords}`)}
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
        title={`${title} (${score})`}
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
  keywords: PropTypes.string,
  score: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  topic: PropTypes.string,
}

export default withStyles(s)(Result)
