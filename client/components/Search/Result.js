import React, { PropTypes } from 'react'
import { Card, CardHeader, CardText } from 'material-ui/Card'

import withStyles from 'u/withStyles'

import s from './result-style.scss'

const Result = ({ body, explanation, displayTitle, score }) => {
  const content = (
    <div className={s.bodyContainer}>
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
        <span className={s.explanation}>
          {explanation}
        </span>
      </CardText>
    </Card>
  )
}

Result.propTypes = {
  body: PropTypes.string.isRequired,
  explanation: PropTypes.string.isRequired,
  displayTitle: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
}

export default withStyles(s)(Result)
