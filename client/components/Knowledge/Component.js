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
    const answers = this.getAnswers()
    const { node: reply } = answers[0]
    this.setState({ activeReply: reply })
  }

  getBot() {
    const { viewer: { bots } } = this.props
    return bots.edges[0].node
  }

  getAnswers() {
    const { answers: { edges: answers } } = this.getBot()
    return answers
  }

  handleChangeReply = reply => this.setState({ activeReply: reply })
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
    return (
      <DocumentTitle title={t('Knowledge')}>
        <div className={s.root}>
          <Navigation />
          <section className={s.content}>
            <div className={s.replyList}>
              <ReplyList
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
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(Knowledge)
