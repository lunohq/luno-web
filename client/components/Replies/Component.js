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
import ViewEditReply from './ViewEditReply'

import s from './style.scss'

class Replies extends Component {
  state={
    reply: null,
  }

  componentWillMount() {
    this.setState({reply:this.props.bot.answers.edges[0].node})
  }

  handleViewReply = (reply) => {
    this.setState({reply})
  }

  render() {
    const replies = this.props.bot.answers.edges

    return (
      <DocumentTitle title={t('Lunobot - Luno')}>
        <div className={s.root}>
          <RepliesList onChange={this.handleViewReply} replies={replies} />
          <ViewEditReply reply={this.state.reply}/>
        </div>
      </DocumentTitle>
    )
  }
}

export default withStyles(s)(Replies)
