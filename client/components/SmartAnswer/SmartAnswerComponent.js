import RaisedButton from 'material-ui/lib/raised-button';
import React from 'react';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

import './SmartAnswer.scss';

export default class SmartAnswer extends React.Component {
  render() {
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
                    <TableRow>
                        <TableRowColumn>Guest WiFi</TableRowColumn>
                        <TableRowColumn>Network: Acme Guest <br /> Password: WelcomeToAcme</TableRowColumn>
                        <TableRowColumn>SF Office</TableRowColumn>
                        <TableRowColumn>Edit Delete</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Benefits Brochure</TableRowColumn>
                        <TableRowColumn>Download our latest benefits brochure: https://drive.google.com/open?id=0B0g1oeNdj7wBYU5TRFJa43llcHc</TableRowColumn>
                        <TableRowColumn>Benefits, New Hire</TableRowColumn>
                        <TableRowColumn>Edit Delete</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>SF Address</TableRowColumn>
                        <TableRowColumn>555 California Street,San Francisco, CA 94104</TableRowColumn>
                        <TableRowColumn>SF Office</TableRowColumn>
                        <TableRowColumn>Edit Delete</TableRowColumn>
                    </TableRow>
                </TableBody>
              </Table>
        </div>
      </div>
    );
  }
}
