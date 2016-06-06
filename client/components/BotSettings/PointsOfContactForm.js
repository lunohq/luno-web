import React, { Component, PropTypes } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import colors from 's/colors'

import AutoCompleteMembers, { createDataSource } from 'c/AutoCompleteMembers'
import CrossIcon from 'c/CrossIcon'

import s from './points-of-contact-form-style.scss'

export const FORM_NAME = 'form/bot-settings/points-of-contact'

function getItemName(item) {
  return `@${item.name}`
}

const Contact = ({ contacts, index, onRemove, value }) => (
  <li className={s.token} onTouchTap={() => onRemove(contacts, value, index)}>
    <span>{`@${value.node.name}`}</span>
    <CrossIcon
      className={s.icon}
      height={16}
      width={16}
      stroke={colors.darkGrey}
    />
  </li>
)

const Contacts = ({ dataSource, onRemove, onNewRequest, onUpdateInput, searchText, fields }) => {
  const tokens = fields.map((contact, index) => (
    <Field
      component={Contact}
      contacts={fields}
      index={index}
      key={index}
      name={contact}
      onRemove={onRemove}
    />
  ))

  return (
    <div>
      <ul className={s.tokenContainer}>
        {tokens}
      </ul>
      <AutoCompleteMembers
        chosenRequestText={() => ''}
        dataSource={dataSource}
        onNewRequest={onNewRequest}
        onUpdateInput={onUpdateInput}
        searchText={searchText}
      />
    </div>
  )
}

class PointsOfContactForm extends Component {

  componentWillMount() {
    this.initialize(this.props)
    this.initializeData(this.props, this.props)
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.existing !== this.props.existing) {
      this.initializeData(nextProps, this.state)
    }
  }

  initialize({ members }) {
    this.setState({ members })
  }

  initializeData({ existing, members }, state) {
    const contacts = []
    for (const contact of existing) {
      let matched
      // On initial invocation we pull out members from the state that have
      // already been selected so the user can't select them again. Subsequent
      // invocations will pull the contact object from the members property
      // which is the full list of members.
      for (const index in state.members) {
        const member = state.members[index]
        // TODO: this should be removed when we've transitioned to storing userId
        // for points of contact
        if (member.node.name === contact) {
          contacts.push(member)
          state.members.splice(index, 1)
          matched = true
          break
        } else if (member.node.userId === contact) {
          contacts.push(member)
          state.members.splice(index, 1)
          matched = true
          break
        }
      }

      if (!matched) {
        for (const member of members) {
          if (member.node.userId === contact) {
            contacts.push(member)
          }
        }
      }
    }
    this.setState({ members: state.members })
    this.props.initialize({ contacts })
  }

  state = {
    searchText: '',
    members: [],
  }

  handleNewRequest = (item, index) => {
    if (index !== -1) {
      const { array: { push }, handleSubmit } = this.props
      const { members } = this.state

      push('contacts', members[index])
      members.splice(index, 1)
      this.setState({ members, searchText: '' }, () => handleSubmit())
    }
  }

  handleRemove = (contacts, contact, index) => {
    const { handleSubmit } = this.props
    const { members } = this.state

    contacts.remove(index)
    members.push(contact)
    this.setState({ members }, () => handleSubmit())
  }

  handleUpdateInput = searchText => this.setState({ searchText })

  render() {
    const { members, searchText } = this.state
    const dataSource = createDataSource(members)
    return (
      <form>
        <div>
          <FieldArray
            component={Contacts}
            dataSource={dataSource}
            name='contacts'
            onNewRequest={this.handleNewRequest}
            onRemove={this.handleRemove}
            onUpdateInput={this.handleUpdateInput}
            searchText={searchText}
          />
        </div>
      </form>
    )
  }
}

PointsOfContactForm.propTypes = {
  // Existing points of contact
  existing: PropTypes.array,
  // All slack team members
  members: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

PointsOfContactForm.defaultProps = {
  existing: [],
}

export default reduxForm({
  form: FORM_NAME,
})(withStyles(s)(PointsOfContactForm))
