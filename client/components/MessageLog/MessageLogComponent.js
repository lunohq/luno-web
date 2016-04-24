import FlatButton from 'material-ui/lib/flat-button'
import React from 'react'
import Table from 'material-ui/lib/table/table'
import TableBody from 'material-ui/lib/table/table-body'
import TableHeader from 'material-ui/lib/table/table-header'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'

export default class MessageLog extends React.Component {
  render() {
    return (
      <div className='smart-answers-container'>
        <div className='col-xs content-body'>
            <div className='row between-xs middle-xs no-margin'>
                <h1>Message Logs</h1>
                <FlatButton
                  label='Export'
                  primary
                />
            </div>
            <hr />
            <p>
                These are the full logs for every message that your Luno Bot replied to. Use the Export button in the upper right to download a csv if you want to do further analysis.
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
                        <TableHeaderColumn>From</TableHeaderColumn>
                        <TableHeaderColumn>Message</TableHeaderColumn>
                        <TableHeaderColumn>Bot Reply</TableHeaderColumn>
                        <TableHeaderColumn>Timestamp</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody
                  deselectOnClickaway
                  displayRowCheckbox={false}
                  showRowHover
                >
                    <TableRow>
                        <TableRowColumn>@ravi</TableRowColumn>
                        <TableRowColumn>wifi password</TableRowColumn>
                        <TableRowColumn>Network: Acme Guest <br /> Password: WelcomeToAcme</TableRowColumn>
                        <TableRowColumn>2016-03-29 3:25 PM</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>@allen</TableRowColumn>
                        <TableRowColumn>where can i get latest benefits info?</TableRowColumn>
                        <TableRowColumn>Download our latest benefits brochure: https://drive.google.com/open?id=0B0g1oeNdj7wBYU5TRFJa43llcHc</TableRowColumn>
                        <TableRowColumn>2016-03-29 3:25 PM</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>@michael</TableRowColumn>
                        <TableRowColumn>office address</TableRowColumn>
                        <TableRowColumn>555 California Street,San Francisco, CA 94104</TableRowColumn>
                        <TableRowColumn>2016-03-29 3:25 PM</TableRowColumn>
                    </TableRow>
                </TableBody>
              </Table>
        </div>
      </div>
    )
  }
}
