import React, { Component, PropTypes } from 'react'

import Paper from 'material-ui/Paper'
import { ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import SelectableList from 'c/SelectableList'

import s from './style.scss'

class ReplyList extends Component {

  render() {
    const { replies, defaultValue } = this.props
    const replyRows = []
    for (const index in replies) {
      const { node } = replies[index]
      replyRows.push(
        <ListItem
          key={index}
          onTouchTap={() => this.props.onChange(node)}
          primaryText={node.title}
          secondaryText={t(`Last updated on ${node.changed}`)}
          value={node.id}
        />
      )
      replyRows.push(<Divider key={`${index}-divider`} />)
    }

    let defaultReplyId = defaultValue
    if (!defaultValue) {
      defaultReplyId = replies[0].node.id
    }

    return (
      <Paper className={s.root}>
        <SelectableList defaultValue={defaultReplyId}>
          <Subheader className={s.header}>
            Lunobot
            <div>
              <FlatButton label={t('Add Reply')} primary />
            </div>
          </Subheader>
          {replyRows}
        </SelectableList>
      </Paper>
    )
  }
}

ReplyList.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  replies: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      changed: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
}

export default withStyles(s)(ReplyList)
