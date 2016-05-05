import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import RaisedButton from 'material-ui/RaisedButton'

import CreateAnswerMutation from '../../mutations/CreateAnswerMutation'
import DeleteAnswerMutation from '../../mutations/DeleteAnswerMutation'
import UpdateAnswerMutation from '../../mutations/UpdateAnswerMutation'
import t from '../../utils/gettext'
import withStyles from '../../utils/withStyles'

import DocumentTitle from '../DocumentTitle'
import Divider from '../Divider/Component'

import AnswersTable from './AnswersTable'
import CreateEditDialog from './CreateEditDialog'
import DeleteDialog from './DeleteDialog'

import s from './style.scss'
import es from './empty-state-style.scss'

const AddAnswer = ({ label, onAddAnswer }) => {
  return (
    <RaisedButton
      label={label}
      onTouchTap={onAddAnswer}
      primary
    />
  )
}

AddAnswer.propTypes = {
  label: PropTypes.string.isRequired,
  onAddAnswer: PropTypes.func,
}

const EmptyState = ({ onAddAnswer }) => (
  <div className={es.root}>
    <div className={es.row}>
      <h3>{t('Add your first smart answer')}</h3>
    </div>
    <div className={es.row}>
      <AddAnswer
        label={t('Add smart answer')}
        onAddAnswer={onAddAnswer}
      />
    </div>
  </div>
)

EmptyState.propTypes = {
  onAddAnswer: PropTypes.func.isRequired,
}

class Answers extends Component {
  state = {
    open: false,
    answerToBeEdited: null,
    showDeleteDialog: false,
    answerToBeDeleted: null,
  }

  getBot() {
    const { viewer: { bots } } = this.props
    return bots.edges[0].node
  }

  hasAnswers() {
    const bot = this.getBot()
    return !!bot.answers.edges.length
  }

  displayForm = () => {
    this.setState({ open: true })
  }

  hideForm = () => {
    this.setState({ open: false, answerToBeEdited: null })
  }

  handleAddAnswer = () => {
    this.setState({ answerToBeEdited: null }, () => this.displayForm())
  }

  handleEditAnswer = (answer) => {
    this.setState({ answerToBeEdited: answer }, () => this.displayForm())
  }

  handleDeleteAnswer = () => {
    const answer = this.state.answerToBeDeleted
    if (answer) {
      const bot = this.getBot()
      Relay.Store.commitUpdate(
        new DeleteAnswerMutation({
          answer,
          bot,
        })
      )
    }

    this.hideDeleteDialog()
  }

  showDeleteDialog = (answer) => {
    this.setState({
      showDeleteDialog: true,
      answerToBeDeleted: answer,
    })
  }

  hideDeleteDialog = () => {
    this.setState({
      showDeleteDialog: false,
      answerToBeDeleted: null,
    })
  }

  handleSubmitAnswer = ({ answer, title, body }) => {
    const bot = this.getBot()
    let mutation
    if (!answer) {
      mutation = new CreateAnswerMutation({
        title,
        body,
        bot,
      })
    } else {
      mutation = new UpdateAnswerMutation({
        answer,
        title,
        body,
      })
    }

    Relay.Store.commitUpdate(mutation)
    this.hideForm()
  }

  render() {
    let addAnswer
    if (this.hasAnswers()) {
      addAnswer = <AddAnswer label={t('Add')} onAddAnswer={this.handleAddAnswer} />
    }

    let content
    const bot = this.getBot()
    if (this.hasAnswers()) {
      content = (
        <AnswersTable
          bot={bot}
          handleDelete={this.showDeleteDialog}
          handleEdit={this.handleEditAnswer}
        />
      )
    } else {
      content = <EmptyState onAddAnswer={this.handleAddAnswer} />
    }

    return (
      <DocumentTitle title={t('Smart answers')}>
        <div className={s.root}>
          <div className={s.content}>
            <div>
              <div className={s.title}>
                <h1>{t('Smart answers')}</h1>
                {addAnswer}
              </div>
              <Divider />
              <p>
                {t('Use smart answers to scale yourself and answer common questions. Your Lunobot will search these smart answers and intelligently reply in any channel that its added to.')}
              </p>
            </div>
            {content}
          </div>
          <CreateEditDialog
            answer={this.state.answerToBeEdited}
            onClose={this.hideForm}
            onSubmit={this.handleSubmitAnswer}
            open={this.state.open}
          />
          <DeleteDialog
            answer={this.state.answerToBeDeleted}
            onClose={this.hideDeleteDialog}
            onSubmit={this.handleDeleteAnswer}
            open={this.state.showDeleteDialog}
          />
        </div>
      </DocumentTitle>
    )
  }
}

Answers.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s, es)(Answers)
