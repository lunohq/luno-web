import React, { PropTypes, Component } from 'react'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import AuthenticatedContent from 'c/AuthenticatedContent/Component'

import ThreadTable from './ThreadTable'

import s from './style.scss'

const EmptyState = () => (
  <div>
    {t('No conversation logs yet')}
  </div>
)

class ThreadLogs extends Component {

  handleViewMore = (thread) => {
    console.log('view more of thread', thread)
  }

  render() {
    const { viewer } = this.props

    let content
    if (viewer.threadLogs) {
      content = <ThreadTable onViewMore={this.handleViewMore} threadEdges={viewer.threadLogs.edges} />
    } else {
      content = <EmptyState />
    }
    return (
      <AuthenticatedContent title={t('Conversation Logs')}>
        {content}
      </AuthenticatedContent>
    )
  }

}

ThreadLogs.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(ThreadLogs)
