import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

import './style.scss';

const AnswerRow = ({ answer: { id, title, body } }) => {
  const cellStyle = { whiteSpace: 'pre-wrap' };

  return (
    <TableRow key={id}>
      <TableRowColumn style={cellStyle}>{title}</TableRowColumn>
      <TableRowColumn style={cellStyle}>{body}</TableRowColumn>
      <TableRowColumn style={cellStyle}>Topic1, Topic2</TableRowColumn>
      <TableRowColumn>Edit Delete</TableRowColumn>
    </TableRow>
  );
};

AnswerRow.propTypes = {
  answer: PropTypes.object.isRequired,
};

const AnswersTable = ({ bot }) => {
  const answerRows = bot.answers.edges.map(({ node }, index) => <AnswerRow answer={node} key={index} />);
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
};

const Answers = ({ viewer: { bots } }) => {
  const bot = bots.edges[0].node;
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
            primary
          />
        </div>
        <hr />
        <p>
            Use Smart Answers to scale yourself and answer common questions. Your Luno Bot will search these Smart Answers and intelligently reply in any channel that its added to.
        </p>
        <AnswersTable bot={bot} />
      </div>
    </div>
  );
};

Answers.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default Answers;
