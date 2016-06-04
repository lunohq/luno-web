import React, { PropTypes } from 'react'

import withStyles from 'u/withStyles'
import BotSettingsContainer from 'c/BotSettings/Container'
import ManageUsersContainer from 'c/ManageUsers/Container'

import Navigation from './Navigation'

import s from './style.scss'

const Admin = ({ location, params: { slug }, viewer }) => {
  let content
  switch (slug) {
    case 'bot':
      content = <BotSettingsContainer viewer={viewer} />
      break
    case 'users':
      content = <ManageUsersContainer viewer={viewer} />
      break
    default:
  }
  return (
    <div>
      <section>
        <Navigation location={location} />
        <section className={s.content}>
          {content}
        </section>
      </section>
    </div>
  )
}

export default withStyles(s)(Admin)
