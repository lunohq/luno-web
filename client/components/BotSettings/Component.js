import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { Snackbar, TextField } from 'material-ui';

import UpdateBotMutation from '../../mutations/UpdateBotMutation';

import DocumentTitle from '../DocumentTitle';
import Divider from '../Divider';

import './style.scss';

const Expertise = ({ bot, onSave }) => {
  return (
    <div className='bot-settings-section'>
      <div className='section-title'>
        <div className='row between-xs middle-xs no-margin'>
          <h1>Expertise</h1>
        </div>
        <Divider />
        <p>
            What types of questions can your Luno Bot answer? Configure your Luno Bot to tell others what it’s an expert in by completing the sentence below.
        </p>
      </div>
      <div className='section-body'>&ldquo;I can answer basic questions related to
        <TextField
          className='expertise-text'
          hintText='E.g., travel or HR and benefits'
          defaultValue={bot.purpose}
          multiLine={false}
          onBlur={onSave}
        />&rdquo;
      </div>
    </div>
  );
};

Expertise.propTypes = {
  bot: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

class BotSettings extends Component {

  state = {
    showSnackbar: false,
    snackbarMessage: '',
  };

  getBot() {
    const { viewer: { bots } } = this.props;
    return bots.edges[0].node;
  }

  handleSaveExpertise = (event) => {
    const purpose = event.target.value;
    const bot = this.getBot();
    const mutation = new UpdateBotMutation({
      bot,
      purpose,
      pointsOfContact: bot.pointsOfContact,
    });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => this.showSnackbar('Saved expertise info!')
    });
  }

  showSnackbar = (message) => {
    this.setState({
      showSnackbar: true,
      snackbarMessage: message,
    });
  }

  hideSnackbar = () => {
    this.setState({
      showSnackbar: false,
      snackbarMessage: ''
    });
  }

  renderExpertiseBody() {
    return (
      <div className='bot-settings-section-body'>&ldquo;I can answer basic questions related to
        <TextField
          className='expertise-text'
          hintText='E.g., travel or HR and benefits'
          multiLine={false}
        />&rdquo;
      </div>
    );
  }

  render() {
    return (
      <DocumentTitle title='Bot Settings'>
        <div className='smart-answers-container'>
          <div className='col-xs content-body'>
            <Expertise
              bot={this.getBot()}
              onSave={this.handleSaveExpertise}
            />
            <Snackbar
              open={this.state.showSnackbar}
              message={this.state.snackbarMessage}
              autoHideDuration={4000}
              onRequestClose={this.hideSnackbar}
            />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

BotSettings.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default BotSettings;
