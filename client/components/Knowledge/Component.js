import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'
import { SubmissionError } from 'redux-form'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import CreateReply from 'm/CreateReply'
import DeleteReply from 'm/DeleteReply'
import UpdateReply from 'm/UpdateReply'
import CreateTopic from 'm/CreateTopic'

import { NAV_WIDTH, MENU_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import DocumentTitle from 'c/DocumentTitle'
import ReplyList from 'c/ReplyList/Component'
import Reply from 'c/Reply/Component'

import DeleteDialog from './DeleteDialog'
import Navigation from './Navigation'
import TopicDialog from './TopicDialog'

import s from './style.scss'

class Knowledge extends Component {

  state = {
    activeReply: {},
    deleteReplyDialogOpen: false,
    replyToDelete: null,
    topicFormOpen: false,
  }

  componentWillMount() {
    this.initialize(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { params: { replyId } } = this.props
    const { params: { replyId: nextReplyId } } = nextProps
    if (replyId !== nextReplyId || this.getReplyEdges(this.props) !== this.getReplyEdges(nextProps)) {
      this.initialize(nextProps)
    }
  }

  getBot(props = this.props) {
    const { viewer: { bots } } = props
    return bots.edges[0].node
  }

  getDefaultTopic() {
    const { viewer: { defaultTopic } } = this.props
    return defaultTopic
  }

  getReplyEdges(props = this.props) {
    const { replies: { edges } } = this.getDefaultTopic(props)
    return edges
  }

  initialize(props) {
    const { params: { replyId } } = props
    const replyEdges = this.getReplyEdges(props)
    if (!replyId) {
      this.routeToDefault({ props })
      return
    }

    let activeReply = {}
    for (const { node: reply } of replyEdges) {
      if (reply.id === replyId) {
        activeReply = reply
        break
      }
    }
    if (replyId !== 'new' && !activeReply.id) {
      this.routeToDefault({ props })
      return
    }
    this.setState({ activeReply })
  }

  routeToDefault({ props = this.props, ignoreId } = {}) {
    const replyEdges = this.getReplyEdges(props)
    let replyId = 'new'
    for (const { node: reply } of replyEdges) {
      if (reply.id !== ignoreId) {
        replyId = reply.id
        break
      }
    }
    this.context.router.replace(`/knowledge/${replyId}`)
  }

  handleNewReply = () => this.context.router.push('/knowledge/new')

  handleChangeReply = reply => {
    this.context.router.push(`/knowledge/${reply.id || 'new'}`)
  }

  handleDeleteReply = () => {
    const { replyToDelete: reply } = this.state
    if (reply) {
      const topic = this.getDefaultTopic()
      const bot = this.getBot()
      Relay.Store.commitUpdate(new DeleteReply({ topic, reply, bot }))
      this.routeToDefault({ ignoreId: reply.id })
    }
    this.hideDeleteReplyDialog()
  }

  handleCancelReply = () => {
    if (!this.state.activeReply.id) {
      this.routeToDefault()
    }
  }

  handleSubmitReply = ({ reply }) => {
    return new Promise((resolve, reject) => {
      const topic = this.getDefaultTopic()
      let mutation
      const bot = this.getBot()
      if (!reply.id) {
        mutation = new CreateReply({ bot, topic, ...reply })
      } else {
        mutation = new UpdateReply({ reply, bot, topic, ...reply })
      }

      const onSuccess = ({ createReply }) => {
        if (createReply) {
          const { replyEdge: { node: { id } } } = createReply
          this.context.router.replace(`/knowledge/${id}`)
        }
        resolve()
      }

      const onFailure = (transaction) => {
        reject(new SubmissionError({ _error: transaction.getError() }))
      }

      Relay.Store.commitUpdate(mutation, { onSuccess, onFailure })
    })
  }

  displayDeleteReplyDialog = reply => this.setState({
    deleteReplyDialogOpen: true,
    replyToDelete: reply,
  })

  hideDeleteReplyDialog = () => this.setState({
    deleteReplyDialogOpen: false,
    replyToDelete: null,
  })

  displayTopicForm = () => this.setState({ topicFormOpen: true })
  hideTopicForm = () => this.setState({ topicFormOpen: false })
  handleSubmitTopic = ({ topic }) => {
    return new Promise((resolve, reject) => {
      const mutation = new CreateTopic({ viewer: this.props.viewer, ...topic })

      const onSuccess = () => {
        this.hideTopicForm()
        resolve()
      }

      const onFailure = (transaction) => {
        reject(new SubmissionError({ _error: transaction.getError() }))
      }

      Relay.Store.commitUpdate(mutation, { onSuccess, onFailure })
    })
  }

  render() {
    const defaultTopic = this.getDefaultTopic()
    let replyEdges = this.getReplyEdges()
    const { params: { replyId } } = this.props
    if (replyId === 'new') {
      replyEdges = [{ node: this.state.activeReply }]
      replyEdges.push(...this.getReplyEdges())
    }
    const focused = replyId === 'new'
    const marginLeft = {
      marginLeft: NAV_WIDTH + MENU_WIDTH,
    }
    return (
      <DocumentTitle title={t('Knowledge')}>
        <div className={s.root}>
          <Navigation
            defaultId={defaultTopic.id}
            onNewTopic={this.displayTopicForm}
          />
          <section
            className={s.content}
            style={marginLeft}
          >
            <div className={s.replyList}>
              <ReplyList
                onChange={this.handleChangeReply}
                onNew={this.handleNewReply}
                replyEdges={replyEdges}
                reply={this.state.activeReply}
              />
            </div>
            <div className={s.reply}>
              <Reply
                focused={focused}
                onCancel={this.handleCancelReply}
                onDelete={this.displayDeleteReplyDialog}
                onSubmit={this.handleSubmitReply}
                reply={this.state.activeReply}
              />
            </div>
          </section>
          <TopicDialog
            open={this.state.topicFormOpen}
            onSubmit={this.handleSubmitTopic}
            onCancel={this.hideTopicForm}
          />
          {(() => !this.state.replyToDelete ? null : (
            <DeleteDialog
              onCancel={this.hideDeleteReplyDialog}
              onConfirm={this.handleDeleteReply}
              open={this.state.deleteReplyDialogOpen}
              reply={this.state.replyToDelete}
            />
          ))()}
        </div>
      </DocumentTitle>
    )
  }

}

Knowledge.propTypes = {
  params: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
}

Knowledge.contextTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default withStyles(s)(Knowledge)
