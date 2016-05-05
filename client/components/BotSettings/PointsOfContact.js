import React, { Component, PropTypes } from 'react'
import { TextField } from 'material-ui'

import t from '../../utils/gettext'
import withStyles from '../../utils/withStyles'

import Divider from '../Divider/Component'
import SectionTitle from '../SectionTitle/Component'

import s from './points-of-contact-style.scss'

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
      <div>
        <div>
          <div className={s.titleContainer}>
            <SectionTitle title={t('Points of contact')} />
          </div>
          <Divider />
          <p className={s.text}>
              {t('To avoid a frustrating phone tree OPERATOR!!! experience, whenever your Lunobot can’t provide a great answer, it will immediately escalate the question to real people.')}
          </p>
        </div>
        <div className={s.body}>
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
          <div className={s.hintText}>{t('Add Slack usernames of people who should be mentioned when escalating.')}</div>
        </div>
      </div>
    )
  }
}

PointsOfContact.propTypes = {
  bot: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default withStyles(s)(PointsOfContact)
