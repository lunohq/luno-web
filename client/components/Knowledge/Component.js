import React, { Component, PropTypes } from 'react'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

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
    if (answerId !== nextAnswerId) this.initialize(nextProps)
  }

  initialize(props) {
    const { params: { answerId } } = props
    const answers = this.get()
    if (!answerId) {
      const { node: answer } = answers[0]
      this.context.router.push(`/knowledge/${answer.id}`)
      return
    }

    let activeAnswer
    if (answerId === 'new') {
      activeAnswer = {}
    } else {
      for (const { node: answer } of answers) {
        if (answer.id === answerId) {
          activeAnswer = answer
          break
        }
      }
    }
    this.setState({ activeAnswer })
  }

  getBot() {
    const { viewer: { bots } } = this.props
    return bots.edges[0].node
  }

  get() {
    const { answers: { edges } } = this.getBot()
    return edges
  }

  handleNewAnswer = () => this.context.router.push('/knowledge/new')
  handleChangeAnswer = answer => {
    this.context.router.push(`/knowledge/${answer.id || 'new'}`)
  }
  handleDeleteAnswer = answer => { console.log('delete answer', answer) }
  displayDeleteAnswerDialog = answer => this.setState({
    deleteAnswerDialogOpen: true,
    answerToDelete: answer,
  })
  hideDeleteAnswerDialog = () => this.setState({
    deleteAnswerDialogOpen: false,
    answerToDelete: null,
  })

  render() {
    let answerEdges = this.get()
    const { params: { answerId } } = this.props
    if (answerId === 'new') {
      answerEdges = [{ node: this.state.activeAnswer }]
      answerEdges.push(...this.get())
    }

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
                onDelete={this.displayDeleteAnswerDialog}
                answer={this.state.activeAnswer}
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
