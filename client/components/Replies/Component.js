import React, { Component, PropTypes } from 'react'

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import DocumentTitle from 'c/DocumentTitle'

import RepliesList from './RepliesList'
import ReplyPane from './ReplyPane'

import s from './style.scss'

class Replies extends Component {
  render() {
    const replies = this.props.bot.answers.edges

    return (
      <DocumentTitle title={t('!!! Topic Name')}>
        <div className={s.root}>
          <RepliesList replies={replies} />
          <ReplyPane />
        </div>
      </DocumentTitle>
    )
  }
}

export default withStyles(s)(Replies)
