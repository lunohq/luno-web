import React, { PropTypes } from 'react'
import Remarkable from 'remarkable'

import withStyles from 'u/withStyles'
import moment from 'u/moment'

import s from './style.scss'

const md = new Remarkable({
  breaks: true,
})

const SlackMessage = ({ message, ...other }) => (
  <div className={s.root} {...other}>
    <div className={s.header}>
      <span className={s.author}>{message.user}</span>
      <span className={s.timestamp}>{moment(message.ts).format('h:mm a')}</span>
    </div>
    <div className={s.content} dangerouslySetInnerHTML={ { __html: md.render(message.text) } } />
  </div>
)

SlackMessage.propTypes = {
  message: PropTypes.object.isRequired,
}

export default withStyles(s)(SlackMessage)
