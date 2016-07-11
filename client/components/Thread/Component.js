import React, { PropTypes } from 'react'
import { List, ListItem } from 'material-ui/List'

const Thread = ({ viewer }) => {
  const events = viewer.threadLog.events.edges.map(({ node }, index) => {
    const secondaryText = (
      <div>
        <p>{`meta: ${node.meta}`}</p>
        <p>{`message: ${node.message ? node.message.text : ''}`}</p>
      </div>
    )
    return (
        <ListItem
          key={index}
          primaryText={node.type}
          secondaryText={secondaryText}
          secondaryTextLines={2}
        />
    )
  })
  return (
    <div>
      <List>
        {events}
      </List>
    </div>
  )
}

Thread.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default Thread
