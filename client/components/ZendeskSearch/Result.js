import React, { PropTypes } from 'react'
import { Card, CardHeader } from 'material-ui/Card'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './result-style.scss'

const Result = ({ title, url, labels }) => {
  const content = (
    <div className={s.bodyContainer}>
      <div className={s.meta}>
        <a href={url} target='_blank'>{t('Link')}</a>
      </div>
      <span className={s.meta}>
        {t(`Labels: ${labels}`)}
      </span>
    </div>
  )
  return (
    <Card>
      <CardHeader title={title} subtitle={content} />
    </Card>
  )
}

Result.propTypes = {
  labels: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default withStyles(s)(Result)
