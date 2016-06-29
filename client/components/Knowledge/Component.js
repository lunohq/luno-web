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
import Loading from 'c/Loading'

import DeleteDialog from './DeleteDialog'
import Navigation from './Navigation'
import TopicDialog from './TopicDialog'

import s from './style.scss'

class Knowledge extends Component {

  state = {
    activeTopic: null,
    activeReply: {},
    deleteReplyDialogOpen: false,
    replyToDelete: null,
    topicFormOpen: false,
  }

  componentWillMount() {
    this.initialize(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { viewer, params: { replyId, topicId } } = this.props
    const { viewer: nextViewer, params: { replyId: nextReplyId, topicId: nextTopicId } } = nextProps
    const shouldInit = (
      topicId !== nextTopicId ||
      replyId !== nextReplyId ||
      viewer !== nextViewer
    )
    if (shouldInit) {
      this.initialize(nextProps)
    }
  }

  // TODO remove when we stop writing answers
  getBot(props = this.props) {
    const { viewer: { bots } } = props
    return bots.edges[0].node
  }

  getDefaultTopic(props = this.props) {
    const { viewer: { defaultTopic } } = props
    return defaultTopic
  }

  getReplyEdges(topic) {
    const { replies } = topic
    return replies && replies.edges ? replies.edges : []
  }

  getAllTopics(props = this.props) {
    const { viewer } = props
    const topics = [viewer.defaultTopic]
    if (viewer.topics && viewer.topics.edges) {
      topics.push(...viewer.topics.edges.map(({ node }) => node))
    }
    return topics
  }

  getTopicEdges(props = this.props) {
    let edges = []
    const { viewer } = props
    if (viewer.topics && viewer.topics.edges) {
      edges = viewer.topics.edges
    }
    return edges
  }

  initialize(props) {
    const { params: { replyId, topicId } } = props
    if (!topicId) {
      this.routeToDefaultTopic({ props })
      return
    }

    if (!replyId) {
      this.routeToDefaultReply({ props })
      return
    }

    let activeTopic
    const topics = this.getAllTopics(props)
    for (const topic of topics) {
      if (topic.id === topicId) {
        activeTopic = topic
        break
      }
    }
    if (!activeTopic) {
      this.routeToDefaultTopic({ props })
      return
    }

    let activeReply = {}
    const replyEdges = this.getReplyEdges(activeTopic)
    for (const { node: reply } of replyEdges) {
      if (reply.id === replyId) {
        activeReply = reply
        break
      }
    }
    if (replyId !== 'new' && !activeReply.id) {
      this.routeToDefaultReply({ props })
      return
    }
    this.setState({ activeTopic, activeReply })
  }

  routeToDefaultTopic({ props, maybeReplyId }) {
    let replyId = maybeReplyId
    if (!replyId) {
      replyId = props.params.replyId
    }
    const defaultTopic = this.getDefaultTopic(props)
    let path = `/knowledge/${defaultTopic.id}`
    if (replyId) {
      path = `${path}/${replyId}`
    }
    this.context.router.replace(path)
  }

  routeToDefaultReply({ props = this.props, ignoreId } = {}) {
    const topics = this.getAllTopics(props)
    const { params: { topicId } } = props

    let topic
    for (const node of topics) {
      if (node.id === topicId) {
        topic = node
        break
      }
    }

    if (!topic) {
      this.routeToDefaultTopic({ props, maybeReplyId: topicId })
      return
    }

    let replyId = 'new'
    const replyEdges = this.getReplyEdges(topic)
    for (const { node: reply } of replyEdges) {
      if (reply.id !== ignoreId) {
        replyId = reply.id
        break
      }
    }
    this.context.router.replace(`/knowledge/${topic.id}/${replyId}`)
  }

  handleNewReply = () => this.context.router.push(`/knowledge/${this.state.activeTopic.id}/new`)

  handleChangeReply = reply => {
    this.context.router.push(`/knowledge/${this.state.activeTopic.id}/${reply.id || 'new'}`)
  }

  handleDeleteReply = () => {
    const { replyToDelete: reply } = this.state
    if (reply) {
      const { activeTopic: topic } = this.state
      const bot = this.getBot()
      Relay.Store.commitUpdate(new DeleteReply({ topic, reply, bot }))
      this.routeToDefaultReply({ ignoreId: reply.id })
    }
    this.hideDeleteReplyDialog()
  }

  handleCancelReply = () => {
    if (!this.state.activeReply.id) {
      this.routeToDefaultReply()
    }
  }

  handleSubmitReply = ({ reply }) => {
    return new Promise((resolve, reject) => {
      let mutation
      const { activeTopic: topic } = this.state
      const bot = this.getBot()
      if (!reply.id) {
        mutation = new CreateReply({ bot, topic, ...reply })
      } else {
        mutation = new UpdateReply({ reply, bot, topic, ...reply })
      }

      const onSuccess = ({ createReply }) => {
        if (createReply) {
          const { replyEdge: { node: { id } }, topic: { id: topicId } } = createReply
          this.context.router.replace(`/knowledge/${topicId}/${id}`)
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

  handleSelectTopic = (topicId) => {
    this.context.router.push(`/knowledge/${topicId}`)
  }

  render() {
    if (!this.state.activeTopic) {
      return <Loading />
    }

    const { activeTopic } = this.state
    const defaultTopic = this.getDefaultTopic()
    let replyEdges = this.getReplyEdges(activeTopic)
    const { params: { replyId } } = this.props
    if (replyId === 'new') {
      replyEdges = [{ node: this.state.activeReply }]
      replyEdges.push(...this.getReplyEdges(activeTopic))
    }

    let topics = []
    const topicEdges = this.getTopicEdges()
    if (topicEdges) {
      topics = topicEdges.map(({ node }) => node)
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
            onSelect={this.handleSelectTopic}
            topicId={this.state.activeTopic.id}
            topics={topics}
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
