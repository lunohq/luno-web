import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import {
  RaisedButton,
} from 'material-ui';

import './style.scss';

import CreateAnswerMutation from '../../mutations/CreateAnswerMutation';
import DeleteAnswerMutation from '../../mutations/DeleteAnswerMutation';
import UpdateAnswerMutation from '../../mutations/UpdateAnswerMutation';

import AnswersTable from './AnswersTable';
import Form from './Form';

const AddAnswer = ({ handleAddAnswer, label }) => {
  return (
    <RaisedButton
      label={label}
      onTouchTap={handleAddAnswer}
      primary
    />
  );
};

AddAnswer.propTypes = {
  handleAddAnswer: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

const EmptyState = ({ handleAddAnswer }) => {
  return (
    <div className='row-xs middle-xs center-xs empty-state'>
      <h3>Add your first smart answer</h3>
      <AddAnswer
        label='Add smart answer'
        handleAddAnswer={handleAddAnswer}
      />
    </div>
  );
};

EmptyState.propTypes = {
  handleAddAnswer: PropTypes.func.isRequired,
};

class Answers extends Component {
  state = {
    open: false,
    answerToBeEdited: null,
  }

  getBot() {
    const { viewer: { bots } } = this.props;
    return bots.edges[0].node;
  }

  hasAnswers() {
    const bot = this.getBot();
    return !!bot.answers.edges.length;
  }

  displayForm = () => {
    this.setState({ open: true });
  }

  hideForm = () => {
    this.setState({ open: false });
  }

  handleAddAnswer = () => {
    this.setState({ answerToBeEdited: null }, () => this.displayForm());
  }

  handleEditAnswer = (answer) => {
    this.setState({ answerToBeEdited: answer }, () => this.displayForm());
  }

  handleDeleteAnswer = (answer) => {
    const bot = this.getBot();
    Relay.Store.commitUpdate(
      new DeleteAnswerMutation({
        answer,
        bot,
      })
    );
  }

  handleSubmitAnswer = ({ title, body }, answer) => {
    const bot = this.getBot();
    let mutation;
    if (!answer) {
      mutation = new CreateAnswerMutation({
        title,
        body,
        bot,
      });
    } else {
      mutation = new UpdateAnswerMutation({
        answer,
        title,
        body,
      });
    }

    Relay.Store.commitUpdate(mutation);
    this.hideForm();
  }

  renderAddAnswer() {
    if (this.hasAnswers()) {
      return (<AddAnswer
        label='Add'
        handleAddAnswer={this.handleAddAnswer}
      />);
    }

    return <span />;
  }

  renderContent() {
    const bot = this.getBot();
    if (this.hasAnswers()) {
      return (
        <AnswersTable
          bot={bot}
          handleDelete={this.handleDeleteAnswer}
          handleEdit={this.handleEditAnswer}
        />
      );
    }

    return <EmptyState handleAddAnswer={this.handleAddAnswer} />;
  }

  render() {
    return (
      <div className='smart-answers-container'>
        <div className='col-xs content-body'>
          <div className='row between-xs middle-xs no-margin'>
            <h1>Smart answers</h1>
            {this.renderAddAnswer()}
          </div>
          <hr />
          <p>
              Use smart answers to scale yourself and answer common questions. Your Luno Bot will search these smart answers and intelligently reply in any channel that its added to.
          </p>
          {this.renderContent()}
        </div>
        <Form
          answer={this.state.answerToBeEdited}
          onClose={this.hideForm}
          onSubmit={this.handleSubmitAnswer}
          open={this.state.open}
        />
      </div>
    );
  }
}

Answers.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default Answers;
