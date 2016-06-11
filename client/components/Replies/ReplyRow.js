import React, { Component, PropTypes } from 'react'
import { ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'


const ReplyRow = ({ reply }) => {
  const { id, title, body } = reply
  return (
    <div>
      <ListItem
        primaryText={title}
        secondaryText={`Last updated on ${id}`}
      />
      <Divider />
    </div>
  )
}

ReplyRow.propTypes = {
  reply: PropTypes.object.isRequired,
}

export default ReplyRow
