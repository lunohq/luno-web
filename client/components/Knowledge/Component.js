import React, { Component, PropTypes } from 'react'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import DocumentTitle from 'c/DocumentTitle'
import ReplyList from 'c/ReplyList/Component'
import Reply from 'c/Reply/Component'

import DeleteDialog from './DeleteDialog'
import Navigation from './Navigation'

import s from './style.scss'

class Knowledge extends Component {

  state = {
    activeReply: null,
    deleteReplyDialogOpen: false,
    replyToDelete: null,
  }

  componentWillMount() {
    this.initialize(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { params: { replyId } } = this.props
    const { params: { replyId: nextReplyId } } = nextProps
    if (replyId !== nextReplyId) this.initialize(nextProps)
  }

  initialize(props) {
    const { params: { replyId } } = props
    const answers = this.getAnswers()
    if (!replyId) {
      const { node: reply } = answers[0]
      this.context.router.push(`/knowledge/${reply.id}`)
      return
    }

    for (const { node: reply } of answers) {
      if (reply.id === replyId) {
        this.setState({ activeReply: reply })
        break
      }
    }
  }

  getBot() {
    const { viewer: { bots } } = this.props
    return bots.edges[0].node
  }

  getAnswers() {
    const { answers: { edges: answers } } = this.getBot()
    return answers
  }

  handleChangeReply = reply => {
    this.context.router.push(`/knowledge/${reply.id}`)
  }
  handleDeleteReply = reply => { console.log('delete reply', reply) }
  displayDeleteReplyDialog = reply => this.setState({
    deleteReplyDialogOpen: true,
    replyToDelete: reply,
  })
  hideDeleteReplyDialog = () => this.setState({
    deleteReplyDialogOpen: false,
    replyToDelete: null,
  })

  render() {
    const { params: { replyId } } = this.props
    return (
      <DocumentTitle title={t('Knowledge')}>
        <div className={s.root}>
          <Navigation />
          <section className={s.content}>
            <div className={s.replyList}>
              <ReplyList
                defaultValue={replyId}
                onChange={this.handleChangeReply}
                replies={this.getAnswers()}
              />
            </div>
            <div className={s.reply}>
              <Reply
                onDelete={this.displayDeleteReplyDialog}
                reply={this.state.activeReply}
              />
            </div>
          </section>
          {(() => !this.state.replyToDelete ? null : (
            <DeleteDialog
              open={this.state.deleteReplyDialogOpen}
              reply={this.state.replyToDelete}
              onCancel={this.hideDeleteReplyDialog}
              onConfirm={this.handleDeleteReply}
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
