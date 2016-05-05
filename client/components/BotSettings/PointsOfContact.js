import React, { Component, PropTypes } from 'react'
import { TextField } from 'material-ui'

import t from '../../utils/gettext';
import Divider from '../Divider/Component'

class PointsOfContact extends Component {

  state = {
    contacts: undefined,
  }

  onBlur = (event) => this.saveContacts(event)

  onChange = (event) => {
    this.setState({ contacts: event.target.value })
  }

  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.saveContacts(event)
    }
  }

  getValidContacts(values) {
    const contacts = values.split(',')
    // Remove spaces and add an explicit @ before each one
    let cleanedContacts = contacts.map(contact => {
      return contact.trim().replace(/@|\s/g, '')
    })

    cleanedContacts = cleanedContacts.filter(contact => contact.length)
    return cleanedContacts
  }

  saveContacts(event) {
    const contacts = this.getValidContacts(event.target.value)
    const { onSave } = this.props
    onSave(contacts)
  }

  render() {
    const { bot } = this.props
    const pointsOfContact = bot.pointsOfContact ? bot.pointsOfContact.join(', ') : ''

    return (
      <div className='bot-settings-section'>
        <div className='section-title'>
          <div className='row between-xs middle-xs no-margin'>
            <h1>{t('Points of contact')}</h1>
          </div>
          <Divider />
          <p>
              {t('To avoid a frustrating phone tree OPERATOR!!! experience, whenever your Lunobot can’t provide a great answer, it will immediately escalate the question to real people.')}
          </p>
        </div>
        <div className='section-body'>
          <TextField
            hintText={t('@username')}
            defaultValue={pointsOfContact}
            multiLine={false}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            ref='pointsOfContact'
            style={{ width: '80%' }}
            value={this.state.contacts}
          />
          <div className='hint-text'>{t('Add Slack usernames of people who should be mentioned when escalating.')}</div>
        </div>
      </div>
    )
  }
}

PointsOfContact.propTypes = {
  bot: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default PointsOfContact
