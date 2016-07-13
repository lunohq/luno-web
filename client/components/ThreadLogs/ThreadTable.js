import React, { Component, PropTypes } from 'react'

import {
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableFooter,
  TableRowColumn,
} from 'material-ui/Table'
import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import Table from 'c/Table/Component'
import ThreadRow from './ThreadRow'
import s from './thread-table-style.scss'

class ThreadTable extends Component {

  state = {
    loading: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.loading && this.props.threadLogs !== nextProps.threadLogs) {
      this.setState({ loading: false })
    }
  }

  handleNextPage = () => {
    this.setState({ loading: true })
    this.props.onNextPage()
  }

  render() {
    const { threadLogs: { edges, pageInfo: { hasNextPage } }, onViewMore } = this.props
    const threadRows = edges.map(({ node }, index) => (
      <ThreadRow
        onViewMore={onViewMore}
        key={index}
        thread={node}
      />
    ))
    return (
      <Table selectable={false}>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>{t('TIME')}</TableHeaderColumn>
            <TableHeaderColumn>{t('USER')}</TableHeaderColumn>
            <TableHeaderColumn>{t('CHANNEL')}</TableHeaderColumn>
            <TableHeaderColumn>{t('MESSAGE')}</TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway
          displayRowCheckbox={false}
          showRowHover
        >
          {threadRows}
        </TableBody>
        <TableFooter adjustForCheckbox={false}>
          <TableRow>
            <TableRowColumn colSpan='4' className={s.footer}>
              <FlatButton
                disabled={this.state.loading || !hasNextPage}
                label={this.state.loading ? t('Loading...') : t('View More')}
                onTouchTap={this.handleNextPage}
              />
            </TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
}

ThreadTable.propTypes = {
  onNextPage: PropTypes.func.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  onViewMore: PropTypes.func.isRequired,
  threadLogs: PropTypes.object.isRequired,
}

export default withStyles(s)(ThreadTable)
