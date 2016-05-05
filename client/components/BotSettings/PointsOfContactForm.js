import React, { Component, PropTypes } from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import AutoComplete from 'material-ui/AutoComplete'

import t from '../../utils/gettext'
import withStyles from '../../utils/withStyles'

import CrossIcon from '../CrossIcon'

import s from './points-of-contact-form-style.scss'

export const FORM_NAME = 'form/bot-settings/points-of-contact'

function getItemName(item) {
  return `@${item.name}`
}

function createDataSource(members) {
  const dataSource = []
  for (const member of members) {
    let text = `@${member.node.name}`
    if (member.node.profile.realName) {
      text = `${text} (${member.node.profile.realName})`
    }
    dataSource.push(text)
  }
  return dataSource
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

  generateTokens = (contacts) => {
    return contacts.map((contact, index) => {
      return (
        <Field key={index} name={contact} component={({ value }) =>
          <li className={s.token} onTouchTap={() => this.handleRemove(contacts, value, index)}>
            <span>{`@${value.node.name}`}</span>
            <CrossIcon
              className={s.icon}
              height={16}
              width={16}
              // TODO come up with a way to abstract this
              stroke='#808080'
            />
          </li>
        } />
      )
    })
  }

  render() {
    const { existing } = this.props
    const { members, searchText } = this.state
    const dataSource = createDataSource(members)
    return (
      <form>
        <div>
          <FieldArray name='contacts' component={contacts =>
            <div>
              <ul className={s.tokenContainer}>
                {this.generateTokens(contacts)}
              </ul>
              <AutoComplete
                dataSource={dataSource}
                filter={AutoComplete.caseInsensitiveFilter}
                hintText={t('@username')}
                onNewRequest={this.handleNewRequest}
                onUpdateInput={this.handleUpdateInput}
                searchText={searchText}
              />
            </div>
          } />
        </div>
      </form>
    )
  }
}

PointsOfContactForm.propTypes = {
  // Existing points of contact
  existing: PropTypes.array.isRequired,
  // All slack team members
  members: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
})(withStyles(s)(PointsOfContactForm))
