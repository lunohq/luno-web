import React, { Component, PropTypes } from 'react'

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './style.scss'

class ListPane extends Component {
  render() {
    return (
      <Paper className={s.listPane} zDepth={1}>
        <List>
          <Subheader>
            Lunobot
            <FlatButton label="Add Reply" primary={true} />
          </Subheader>
          <ListItem
            primaryText="Company Address"
            secondaryText="Last updated by @michael on Apr 4, 2016"
          />
          <Divider />
          <ListItem
            primaryText="Guest Wifi Password"
            secondaryText="Last updated by @allen on Mar 30, 2016"
          />
          <Divider />
        </List>
      </Paper>
    )
  }
}

export default withStyles(s)(ListPane)
