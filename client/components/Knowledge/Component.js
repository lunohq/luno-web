import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import CreateAnswerMutation from 'm/CreateAnswerMutation'
import DeleteAnswerMutation from 'm/DeleteAnswerMutation'
import UpdateAnswerMutation from 'm/UpdateAnswerMutation'

import DocumentTitle from 'c/DocumentTitle'
import AnswerList from 'c/AnswerList/Component'
import Answer from 'c/Answer/Component'

import DeleteDialog from './DeleteDialog'
import Navigation from './Navigation'

import s from './style.scss'

class Knowledge extends Component {

  state = {
    activeAnswer: {},
    deleteAnswerDialogOpen: false,
    answerToDelete: null,
  }

  componentWillMount() {
    this.initialize(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { params: { answerId } } = this.props
    const { params: { answerId: nextAnswerId } } = nextProps
    if (answerId !== nextAnswerId || this.getAnswerEdges(this.props) !== this.getAnswerEdges(nextProps)) {
      this.initialize(nextProps)
    }
  }

  initialize(props) {
    const { params: { answerId } } = props
    const answers = this.getAnswerEdges(props)
    if (!answerId) {
      this.routeToDefault({ props })
      return
    }

    let activeAnswer = {}
    for (const { node: answer } of answers) {
      if (answer.id === answerId) {
        activeAnswer = answer
        break
      }
    }
    this.setState({ activeAnswer })
  }

  getBot(props=this.props) {
    const { viewer: { bots } } = props
    return bots.edges[0].node
  }

  getAnswerEdges(props=this.props) {
    const { answers: { edges } } = this.getBot(props)
    return edges
  }

  routeToDefault({ props=this.props, ignoreId }) {
    const answerEdges = this.getAnswerEdges(props)
    let answerId = 'new'
    for (const { node: answer } of answerEdges) {
      if (answer.id !== ignoreId) {
        answerId = answer.id
        break
      }
    }
    this.context.router.replace(`/knowledge/${answerId}`)
  }

  handleNewAnswer = () => this.context.router.push('/knowledge/new')

  handleChangeAnswer = answer => {
    this.context.router.push(`/knowledge/${answer.id || 'new'}`)
  }

  handleDeleteAnswer = () => {
    const { answerToDelete: answer } = this.state
    if (answer) {
      const bot = this.getBot()
      Relay.Store.commitUpdate(new DeleteAnswerMutation({ answer, bot }))
      this.routeToDefault({ ignoreId: answer.id })
    }
    this.hideDeleteAnswerDialog()
  }

  handleCancelAnswer = () => {
    if (!this.state.activeAnswer.id) {
      this.routeToDefault()
    }
  }

  handleSubmitAnswer = ({ answer }) => {
    let mutation
    if (!answer.id) {
      const bot = this.getBot()
      mutation = new CreateAnswerMutation({ bot, ...answer })
    } else {
      mutation = new UpdateAnswerMutation({ answer, ...answer })
    }

    Relay.Store.commitUpdate(mutation, { onSuccess: ({ createAnswer }) => {
      if (createAnswer) {
        const { answerEdge: { node: { id } } } = createAnswer
        this.context.router.replace(`/knowledge/${id}`)
      }
    } })
  }

  displayDeleteAnswerDialog = answer => this.setState({
    deleteAnswerDialogOpen: true,
    answerToDelete: answer,
  })

  hideDeleteAnswerDialog = () => this.setState({
    deleteAnswerDialogOpen: false,
    answerToDelete: null,
  })

  render() {
    let answerEdges = this.getAnswerEdges()
    const { params: { answerId } } = this.props
    if (answerId === 'new') {
      answerEdges = [{ node: this.state.activeAnswer }]
      answerEdges.push(...this.getAnswerEdges())
    }
    const focused = answerId === 'new'
    return (
      <DocumentTitle title={t('Knowledge')}>
        <div className={s.root}>
          <Navigation />
          <section className={s.content}>
            <div className={s.answerList}>
              <AnswerList
                onChange={this.handleChangeAnswer}
                onNew={this.handleNewAnswer}
                answerEdges={answerEdges}
                answer={this.state.activeAnswer}
              />
            </div>
            <div className={s.answer}>
              <Answer
                answer={this.state.activeAnswer}
                onCancel={this.handleCancelAnswer}
                onDelete={this.displayDeleteAnswerDialog}
                onSubmit={this.handleSubmitAnswer}
                focused={focused}
              />
            </div>
          </section>
          {(() => !this.state.answerToDelete ? null : (
            <DeleteDialog
              open={this.state.deleteAnswerDialogOpen}
              answer={this.state.answerToDelete}
              onCancel={this.hideDeleteAnswerDialog}
              onConfirm={this.handleDeleteAnswer}
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
