import React, { Component, PropTypes } from 'react'

import Paper from 'material-ui/Paper'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import ReplyRow from './ReplyRow'

import s from './style.scss'

class ListPane extends Component {

  render() {
    const replyRows = this.props.replies.map(({ node }, index) => (
      <ReplyRow
        reply={node}
        key={index}
      />
    ))

    return (
      <Paper className={s.replyListPane}>
        <List>

          <Subheader className={s.header}>
            Lunobot
            <div>
              <FlatButton label="Add Reply" primary={true} />
            </div>
          </Subheader>

          {replyRows}
        </List>
      </Paper>
    )
  }
}

export default withStyles(s)(ListPane)
