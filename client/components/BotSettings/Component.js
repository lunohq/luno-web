import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'
import { Snackbar } from 'material-ui'

import UpdateBotMutation from '../../mutations/UpdateBotMutation'
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

  handleSaveExpertise = (event) => {
    const purpose = event.target.value
    const bot = this.getBot()
    const pointsOfContact = bot.pointsOfContact
    const mutation = new UpdateBotMutation({
      bot,
      purpose,
      pointsOfContact,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => this.showSnackbar('Saved expertise info!')
    })
  }

  handleSavePointsOfContact = (pointsOfContact) => {
    const bot = this.getBot()
    const purpose = bot.purpose
    const mutation = new UpdateBotMutation({
      bot,
      purpose,
      pointsOfContact,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => this.showSnackbar('Saved points of contact!')
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
    return (
      <DocumentTitle title={t('Bot settings')}>
        <div className={s.root}>
          <Expertise
            bot={this.getBot()}
            onSave={this.handleSaveExpertise}
          />
          <PointsOfContact
            bot={this.getBot()}
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
