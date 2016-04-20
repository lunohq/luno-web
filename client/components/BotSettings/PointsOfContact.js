import React, { Component, PropTypes } from 'react';
import { TextField } from 'material-ui';

import Divider from '../Divider';

class PointsOfContact extends Component {

  state = {
    contacts: undefined,
  }

  onBlur = (event) => this.saveContacts(event);

  onChange = (event) => {
    this.setState({
      contacts: this.getValidContacts(event.target.value)
    });
  }

  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.saveContacts(event);
    }
  }

  getValidContacts(values) {
    const contacts = values.split(',');
    // Remove spaces and add an explicit @ before each one
    let cleanedContacts = contacts.map(contact => {
      return `@${contact.trim().replace(/@|\s/g, '')}`;
    });

    cleanedContacts = cleanedContacts.filter(contact => contact.length);
    return cleanedContacts;
  }

  saveContacts(event) {
    const contacts = this.getValidContacts(event.target.value);
    const { onSave } = this.props;
    onSave(contacts);
  }

  render() {
    const { bot } = this.props;
    const validContacts = this.state.contacts ? this.state.contacts.join(', ') : undefined;

    return (
      <div className='bot-settings-section'>
        <div className='section-title'>
          <div className='row between-xs middle-xs no-margin'>
            <h1>Points of contact</h1>
          </div>
          <Divider />
          <p>
              To avoid a frustrating “phone tree / OPERATOR!!!” experience, whenever your Luno Bot can’t provide a great answer, it will immediately escalate the question to real humans.
          </p>
        </div>
        <div className='section-body'>
          <TextField
            floatingLabelText='Points of contact'
            hintText='@username'
            defaultValue={bot.pointsOfContact.join(', ')}
            multiLine={false}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            ref='pointsOfContact'
            style={{ width: '80%' }}
            value={validContacts}
          />
          <div className='hint-text'>Add Slack usernames of people who should be mentioned when escalating. E.g., @ravi, @allen, @michael</div>
        </div>
      </div>
    );
  }
}

PointsOfContact.propTypes = {
  bot: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default PointsOfContact;
