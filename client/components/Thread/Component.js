import React, { PropTypes } from 'react'

import withStyles from 'u/withStyles'

import SlackMessage from 'c/SlackMessage/Component'

import s from './style.scss'

const Thread = ({ viewer }) => {
  const messages = viewer.threadLog.events.edges.map(({ node: { message } }, index) => (
    <SlackMessage key={index} message={message} />
  ))
  return (
    <div className={s.container}>
      {messages}
    </div>
  )
}

Thread.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(Thread)
