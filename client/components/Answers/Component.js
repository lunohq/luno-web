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

import Form from './Form';

const AnswerRow = ({ answer, handleDelete }) => {
  const cellStyle = { whiteSpace: 'pre-wrap' };

  const deleteAnswer = (answerToDelete) => {
    console.log(answerToDelete.id);
    handleDelete(answerToDelete);
  };

  const { id, title, body } = answer;
  console.log(id);
  return (
    <TableRow key={id}>
      <TableRowColumn style={cellStyle}>{title}</TableRowColumn>
      <TableRowColumn style={cellStyle}>{body}</TableRowColumn>
      <TableRowColumn style={cellStyle}>Topic1, Topic2</TableRowColumn>
      <TableRowColumn>
        <FlatButton
          label='Delete'
          onClick={() => deleteAnswer(answer)}
        />
      </TableRowColumn>
    </TableRow>
  );
};

AnswerRow.propTypes = {
  answer: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

const AnswersTable = ({ bot, handleDelete }) => {
  const answerRows = bot.answers.edges.map(({ node }, index) => {
    return (<AnswerRow
      answer={node}
      handleDelete={handleDelete}
      key={index}
    />);
  });
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
};

class Answers extends Component {

  state = {
    open: false,
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

  handleSubmitAnswer = ({ title, body }) => {
    const bot = this.getBot();
    Relay.Store.commitUpdate(
      new CreateAnswerMutation({
        title,
        body,
        bot,
      })
    );
    this.hideForm();
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

  render() {
    const bot = this.getBot();
    return (
      <div className='smart-answers-container'>
        <aside className='col-xs sub-nav-container'>
          <div className='sub-nav-title'>Luno Bot</div>
          <hr />
          <ul>
            <li className='sub-nav-item selected'>Smart Answers</li>
            <li className='sub-nav-item'>Bot Settings</li>
          </ul>
        </aside>
        <div className='col-xs content-body'>
          <div className='row between-xs middle-xs no-margin'>
            <h1>Smart Answers</h1>
            <RaisedButton
              label='Add'
              onTouchTap={this.displayForm}
              primary
            />
          </div>
          <hr />
          <p>
              Use Smart Answers to scale yourself and answer common questions. Your Luno Bot will search these Smart Answers and intelligently reply in any channel that its added to.
          </p>
          <AnswersTable
            bot={bot}
            handleDelete={this.handleDeleteAnswer}
          />
        </div>
        <Form
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
