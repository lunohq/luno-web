import React, { Component, PropTypes } from 'react'

import withStyles from 'u/withStyles'
import BotSettingsContainer from 'c/BotSettings/Container'
import ManageUsersContainer from 'c/ManageUsers/Container'
import NotFound from 'c/NotFound/Component'

import Navigation from './Navigation'

import s from './style.scss'

class Admin extends Component {

  render() {
    const { location, params: { slug }, viewer } = this.props
    if (!viewer.isAdmin) {
      return <NotFound />
    }

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
}

Admin.propTypes = {
  viewer: PropTypes.shape({
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
}

export default withStyles(s)(Admin)
