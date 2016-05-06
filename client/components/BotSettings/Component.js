import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'
import { Snackbar } from 'material-ui'

import UpdateBotPurposeMutation from '../../mutations/UpdateBotPurposeMutation'
import UpdateBotPointsOfContactMutation from '../../mutations/UpdateBotPointsOfContactMutation'
import t from '../../utils/gettext'
import withStyles from '../../utils/withStyles'

import DocumentTitle from '../DocumentTitle'

import Expertise from './Expertise'
import PointsOfContact from './PointsOfContact'

import s from './style.scss'

class BotSettings extends Component {

  state = {
    showSnackbar: false,
    snackbarMessage: '',
  }

  getBot() {
    const { viewer: { bots } } = this.props
    return bots.edges[0].node
  }

  handleSaveExpertise = ({ purpose }) => {
    const bot = this.getBot()
    const mutation = new UpdateBotPurposeMutation({
      bot,
      purpose,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => this.showSnackbar('Saved expertise info!')
    })
  }

  handleSavePointsOfContact = ({ contacts }) => {
    const pointsOfContact = contacts.map(contact => contact.node.userId)
    const bot = this.getBot()
    const mutation = new UpdateBotPointsOfContactMutation({
      bot,
      pointsOfContact,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => this.showSnackbar('Saved points of contact!'),
    })
  }

  showSnackbar = (message) => {
    this.setState({
      showSnackbar: true,
      snackbarMessage: message,
    })
  }

  hideSnackbar = () => {
    this.setState({
      showSnackbar: false,
      snackbarMessage: ''
    })
  }

  render() {
    const { viewer: { team: { members: { edges: members } } } } = this.props;
    return (
      <DocumentTitle title={t('Bot settings')}>
        <div className={s.root}>
          <Expertise
            bot={this.getBot()}
            onSave={this.handleSaveExpertise}
          />
          <PointsOfContact
            bot={this.getBot()}
            members={members}
            onSave={this.handleSavePointsOfContact}
          />
          <Snackbar
            open={this.state.showSnackbar}
            message={this.state.snackbarMessage}
            autoHideDuration={4000}
            onRequestClose={this.hideSnackbar}
          />
        </div>
      </DocumentTitle>
    )
  }
}

BotSettings.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(BotSettings)
