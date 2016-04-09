import RaisedButton from 'material-ui/lib/raised-button';
import React, { PropTypes } from 'react';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

import './Style.scss';
import SmartAnswerForm from './Form';

export default class SmartAnswer extends React.Component {
  static propTypes = {
    viewer: PropTypes.object,
  };

  state = {
    open: false,
  }

  openSmartAnswerForm() {
    this.setState({
      open: true
    });
  }

  closeSmartAnswerForm() {
    this.setState({
      open: false
    });
  }

  renderSmartAnswers() {
    const { bots } = this.props.viewer;
    const answerRows = [];

    if (bots && bots.edges.length) {
      const answers = bots.edges[0].node.answers.edges;
      const cellStyle = { whiteSpace: 'pre-wrap' };
      for (const answer of answers) {
        answerRows.push(
          <TableRow key={answer.node.id}>
            <TableRowColumn style={cellStyle}>{answer.node.title}</TableRowColumn>
            <TableRowColumn style={cellStyle}>{answer.node.body}</TableRowColumn>
            <TableRowColumn style={cellStyle}>Topic1, Topic2</TableRowColumn>
            <TableRowColumn>Edit Delete</TableRowColumn>
          </TableRow>
        );
      }
    }

    return answerRows;
  }

  render() {
    console.log(this.props.viewer);
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
                  onClick={::this.openSmartAnswerForm}
                  primary
                />
            </div>
            <hr />
            <p>
                Use Smart Answers to scale yourself and answer common questions. Your Luno Bot will search these Smart Answers and intelligently reply in any channel that its added to.
            </p>
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
                    {this.renderSmartAnswers()}
                </TableBody>
              </Table>
        </div>
        <SmartAnswerForm
          handleSubmit={() => {}}
          handleClose={::this.closeSmartAnswerForm}
          open={this.state.open}
        />
      </div>
    );
  }
}
