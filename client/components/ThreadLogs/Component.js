import React, { PropTypes, Component } from 'react'

import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import AuthenticatedContent from 'c/AuthenticatedContent/Component'
import Dialog from 'c/Dialog'
import Thread from 'c/Thread/Component'
import Loading from 'c/Loading'

import ThreadTable from './ThreadTable'

import s from './style.scss'

const EmptyState = () => (
  <div>
    {t('No conversation logs yet')}
  </div>
)

const ThreadDialog = ({ onClose, open, viewer }) => {
  const actions = [
    <FlatButton
      label={t('Close')}
      primary
      onTouchTap={onClose}
    />
  ]

  let content
  if (viewer.threadLog) {
    content = <Thread viewer={viewer} />
  } else {
    content = (
      <div style={{ padding: 24 }}>
        <Loading size={0.75} />
      </div>
    )
  }
  return (
    <Dialog
      actions={actions}
      autoScrollBodyContent
      open={open}
      onRequestClose={onClose}
      title={t('Conversation Details')}
    >
      {content}
    </Dialog>
  )
}

ThreadDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  viewer: PropTypes.object.isRequired,
}

class ThreadLogs extends Component {

  state = {
    displayThreadDialog: false,
  }

  componentWillMount() {
    if (this.props.threadId) {
      this.setState({ displayThreadDialog: true })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.threadId && !this.props.threadId) {
      this.setState({ displayThreadDialog: true })
    } else if (this.props.threadId && !nextProps.threadId) {
      this.setState({ displayThreadDialog: false })
    }
  }

  handleViewMore = (thread) => {
    this.setState({ displayThreadDialog: true })
    this.context.router.push(`/logs/${thread.id}`)
  }

  handleCloseThread = () => {
    this.setState({ displayThreadDialog: false })
    this.context.router.push('/logs')
  }

  handleNextPage = () => {
    const { relay: { setVariables, variables: { threadLogs, pageSize } } } = this.props
    setVariables({ threadLogs: threadLogs + pageSize })
  }

  render() {
    const { viewer } = this.props
    let content
    if (viewer.threadLogs) {
      content = (
        <ThreadTable
          onNextPage={this.handleNextPage}
          onPreviousPage={this.handleNextPage}
          onViewMore={this.handleViewMore}
          threadLogs={viewer.threadLogs}
        />
      )
    } else {
      content = <EmptyState />
    }
    return (
      <AuthenticatedContent title={t('Conversation Logs')}>
        {content}
        <ThreadDialog
          onClose={this.handleCloseThread}
          open={this.state.displayThreadDialog}
          viewer={viewer}
        />
      </AuthenticatedContent>
    )
  }

}

ThreadLogs.propTypes = {
  relay: PropTypes.object.isRequired,
  threadId: PropTypes.string,
  viewer: PropTypes.object.isRequired,
}

ThreadLogs.contextTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default withStyles(s)(ThreadLogs)
