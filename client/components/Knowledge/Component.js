import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'
import { SubmissionError } from 'redux-form'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import CreateReply from 'm/CreateReply'
import DeleteReply from 'm/DeleteReply'
import UpdateReply from 'm/UpdateReply'
import CreateTopic from 'm/CreateTopic'
import UpdateTopic from 'm/UpdateTopic'
import DeleteTopic from 'm/DeleteTopic'

import { NAV_WIDTH, MENU_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import DocumentTitle from 'c/DocumentTitle'
import ReplyList from 'c/ReplyList/Component'
import Reply from 'c/Reply/Component'
import Loading from 'c/Loading'
import TopicDialog from 'c/TopicDialog/Component'

import Navigation from './Navigation'

import s from './style.scss'

class Knowledge extends Component {

  state = {
    activeTopic: null,
    activeReply: {},
    deleteReplyDialogOpen: false,
    deleteErrorOpen: false,
    topicFormOpen: false,
    routing: null,
    topicToEdit: null,
  }

  componentWillMount() {
    this.initialize(this.props)
  }

  componentWillReceiveProps(nextProps, nextState) {
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
    if (this.state.routing && props.location.pathname !== this.state.routing) {
      return
    } else if (this.state.routing) {
      this.setState({ routing: null })
    }
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

  handleDeleteReply = (reply) => {
    return new Promise((resolve, reject) => {
      const { activeTopic: topic } = this.state
      const bot = this.getBot()

      const onSuccess = () => {
        this.routeToDefaultReply({ ignoreId: reply.id })
        resolve()
      }
      const onFailure = (transaction) => {
        reject(new SubmissionError({ _error: transaction.getError() }))
      }

      Relay.Store.commitUpdate(new DeleteReply({ topic, reply, bot }), { onSuccess, onFailure })
    })
  }

  handleCancelReply = () => {
    if (!this.state.activeReply.id) {
      this.routeToDefaultReply()
    }
  }

  handleSubmitReply = ({ reply }) => {
    return new Promise((resolve, reject) => {
      let mutation
      const bot = this.getBot()
      const { activeTopic } = this.state
      if (!reply.id) {
        mutation = new CreateReply({ bot, ...reply })
      } else {
        const topics = this.getAllTopics()
        let topic
        topics.forEach(t => {
          if (t.id === reply.topicId) {
            topic = t
          }
        })
        mutation = new UpdateReply({ reply, bot, previousTopic: activeTopic, topic, ...reply })
      }

      const onSuccess = ({ createReply, updateReply }) => {
        if (createReply) {
          const { replyEdge: { node: { id } } } = createReply
          this.context.router.replace(`/knowledge/${reply.topicId}/${id}`)
        } else if (updateReply && activeTopic.id !== reply.topicId) {
          const path = `/knowledge/${reply.topicId}/${reply.id}`
          this.setState({ routing: path }, () => this.context.router.replace(path))
        }
        resolve()
      }

      const onFailure = (transaction) => {
        reject(new SubmissionError({ _error: transaction.getError() }))
      }

      Relay.Store.commitUpdate(mutation, { onSuccess, onFailure })
    })
  }

  displayTopicForm = () => this.setState({ topicFormOpen: true })
  hideTopicForm = () => this.setState({ topicFormOpen: false, topicToEdit: null })

  handleDeleteTopic = (topic) => {
    const { viewer } = this.props
    const mutation = new DeleteTopic({ topic, viewer })
    // TODO display a snackbar if this fails
    Relay.Store.commitUpdate(mutation)
    this.hideTopicForm()
    this.context.router.push(`/knowledge/${viewer.defaultTopic.id}`)
  }

  handleSubmitTopic = ({ topic }) => {
    return new Promise((resolve, reject) => {
      let mutation
      if (topic.id) {
        mutation = new UpdateTopic({ topic, ...topic })
      } else {
        mutation = new CreateTopic({ viewer: this.props.viewer, ...topic })
      }

      const onSuccess = ({ createTopic, updateTopic }) => {
        let topicId
        if (createTopic) {
          topicId = createTopic.topic.id
        } else {
          topicId = updateTopic.topic.id
        }

        this.hideTopicForm()
        this.context.router.push(`/knowledge/${topicId}`)
        resolve()
      }

      const onFailure = (transaction) => {
        const errors = {}
        const err = transaction.getError()
        if (err.message.includes('DuplicateTopicNameException')) {
          errors.topic = { name: t('Topic names must be unique') }
        } else {
          errors._error = err
        }
        reject(new SubmissionError(errors))
      }

      Relay.Store.commitUpdate(mutation, { onSuccess, onFailure })
    })
  }

  handleSelectTopic = (topicId) => {
    this.context.router.push(`/knowledge/${topicId}`)
  }

  handleEditTopic = () => {
    this.setState({ topicToEdit: this.state.activeTopic, topicFormOpen: true })
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

    const topicsWithDefault = this.getAllTopics()

    let topics = []
    const topicEdges = this.getTopicEdges()
    if (topicEdges) {
      topics = topicEdges.map(({ node }) => node)
    }
    const focused = replyId === 'new'
    const marginLeft = {
      // Add a 5px bumper
      marginLeft: NAV_WIDTH + MENU_WIDTH + 5,
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
          <div className={s.contentContainer} style={marginLeft}>
            <section className={s.content}>
              <div className={s.replyList}>
                <ReplyList
                  onChange={this.handleChangeReply}
                  onNew={this.handleNewReply}
                  onEditTopic={this.handleEditTopic}
                  replyEdges={replyEdges}
                  reply={this.state.activeReply}
                  topic={this.state.activeTopic}
                />
              </div>
              <div className={s.reply}>
                <Reply
                  focused={focused}
                  onCancel={this.handleCancelReply}
                  onDelete={this.handleDeleteReply}
                  onSubmit={this.handleSubmitReply}
                  reply={this.state.activeReply}
                  topic={this.state.activeTopic}
                  topics={topicsWithDefault}
                />
              </div>
            </section>
          </div>
          <TopicDialog
            onCancel={this.hideTopicForm}
            onDelete={this.handleDeleteTopic}
            onSubmit={this.handleSubmitTopic}
            open={this.state.topicFormOpen}
            topic={this.state.topicToEdit}
          />
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
