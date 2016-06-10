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

import ListPane from './ListPane'

import s from './style.scss'

const topics = [
  <MenuItem key={1} value={1} primaryText="None" />,
  <MenuItem key={2} value={2} primaryText="Sales Resources" />,
  <MenuItem key={3} value={3} primaryText="Sales Tools" />,
  <MenuItem key={4} value={4} primaryText="Pricing" />,
]

class Topics extends Component {
  constructor(props) {
    super(props)
    this.state = {value: 1}
  }

  handleChange = (event, index, value) => this.setState({value})

  render() {
    return (
      <DocumentTitle title={t('!!! Topic Name')}>
        <div className={s.root}>
          <ListPane />

          <Paper className={s.detailPane} zDepth={1}>
            <Subheader>
              Last updated by @michael on May 30, 2016
            </Subheader>
            <div className={s.detailContent}>
              <TextField
                floatingLabelText="Title"
                hintText="Add a title"
                floatingLabelFixed={true}
                fullWidth={true}
                multiLine={true}
              />
              <br />
              <TextField
                floatingLabelText="Reply"
                hintText="Add reply"
                floatingLabelFixed={true}
                fullWidth={true}
                multiLine={true}
                rows={3}
              />
              <SelectField
                value={this.state.value}
                onChange={this.handleChange}
                floatingLabelFixed={true}
                floatingLabelText="Topic"
              >
                {topics}
              </SelectField>
            </div>
          </Paper>
        </div>
      </DocumentTitle>
    )
  }
}

export default withStyles(s)(Topics)
