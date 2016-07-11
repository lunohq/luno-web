import React, { PropTypes, Component } from 'react'

import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import AuthenticatedContent from 'c/AuthenticatedContent/Component'
import Dialog from 'c/Dialog'
import Thread from 'c/Thread/Component'

import ThreadTable from './ThreadTable'

import s from './style.scss'

const EmptyState = () => (
  <div>
    {t('No conversation logs yet')}
  </div>
)

const ThreadDialog = ({ onClose, viewer }) => {
  const actions = [
    <FlatButton
      label={t('Close')}
      primary
      onTouchTap={onClose}
    />
  ]
  return (
    <Dialog
      actions={actions}
      autoScrollBodyContent
      open={!!viewer.threadLog}
      onRequestClose={onClose}
      title={t('Conversation Details')}
    >
      <Thread viewer={viewer} />
    </Dialog>
  )
}

ThreadDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  viewer: PropTypes.object.isRequired,
}

class ThreadLogs extends Component {

  handleViewMore = (thread) => {
    this.context.router.push(`/logs/${thread.id}`)
  }

  handleCloseThread = () => this.context.router.push('/logs')

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
        <ThreadDialog
          onClose={this.handleCloseThread}
          viewer={viewer}
        />
      </AuthenticatedContent>
    )
  }

}

ThreadLogs.propTypes = {
  relay: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
}

ThreadLogs.contextTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default withStyles(s)(ThreadLogs)
