import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import {
  FlatButton,
  RaisedButton,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui';

import './style.scss';

import CreateAnswerMutation from '../../mutations/CreateAnswerMutation';
import DeleteAnswerMutation from '../../mutations/DeleteAnswerMutation';
import UpdateAnswerMutation from '../../mutations/UpdateAnswerMutation';

import Form from './Form';

const AnswerRow = ({ answer, handleDelete, handleEdit }) => {
  const cellStyle = { whiteSpace: 'pre-wrap' };

  const editAnswer = (answerToEdit) => {
    handleEdit(answerToEdit);
  };

  const deleteAnswer = (answerToDelete) => {
    handleDelete(answerToDelete);
  };

  const { id, title, body } = answer;
  return (
    <TableRow key={id}>
      <TableRowColumn style={cellStyle}>{title}</TableRowColumn>
      <TableRowColumn style={cellStyle}>{body}</TableRowColumn>
      <TableRowColumn style={cellStyle}>Topic1, Topic2</TableRowColumn>
      <TableRowColumn>
        <FlatButton
          label='Edit'
          onTouchTap={() => editAnswer(answer)}
        />
        <FlatButton
          label='Delete'
          onTouchTap={() => deleteAnswer(answer)}
        />
      </TableRowColumn>
    </TableRow>
  );
};

AnswerRow.propTypes = {
  answer: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

const AnswersTable = ({ bot, handleDelete, handleEdit }) => {
  const answerRows = bot.answers.edges.map(({ node }, index) => <AnswerRow
    answer={node}
    handleDelete={handleDelete}
    handleEdit={handleEdit}
    key={index}
  />);
  return (
    <Table
      fixedFooter
      fixedHeader
      selectable={false}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>Title</TableHeaderColumn>
          <TableHeaderColumn>Smart Answer</TableHeaderColumn>
          <TableHeaderColumn>Topics</TableHeaderColumn>
          <TableHeaderColumn />
        </TableRow>
      </TableHeader>
      <TableBody
        deselectOnClickaway
        displayRowCheckbox={false}
        showRowHover
      >
        {answerRows}
      </TableBody>
    </Table>
  );
};

AnswersTable.propTypes = {
  bot: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
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

  handleSubmitAnswer = ({ title, body }, id) => {
    const bot = this.getBot();
    let mutation;
    if (id === undefined || id === null) {
      mutation = new CreateAnswerMutation({
        title,
        body,
        bot,
      });
    } else {
      mutation = new UpdateAnswerMutation({
        answer: {
          title,
          body,
          id
        }
      });
    }

    Relay.Store.commitUpdate(mutation);
    this.hideForm();
  }

  render() {
    const bot = this.getBot();
    return (
      <div className='smart-answers-container'>
        <aside className='col-xs sub-nav-container'>
          <div className='sub-nav-title'>Luno Bot</div>
          <hr />
          <ul>
            <li className='sub-nav-item selected'>Smart answers</li>
            <li className='sub-nav-item'>Bot settings</li>
          </ul>
        </aside>
        <div className='col-xs content-body'>
          <div className='row between-xs middle-xs no-margin'>
            <h1>Smart answers</h1>
            <RaisedButton
              label='Add'
              onTouchTap={this.displayForm}
              primary
            />
          </div>
          <hr />
          <p>
              Use smart answers to scale yourself and answer common questions. Your Luno Bot will search these smart answers and intelligently reply in any channel that its added to.
          </p>
          <AnswersTable
            bot={bot}
            handleDelete={this.handleDeleteAnswer}
            handleEdit={this.handleEditAnswer}
          />
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
