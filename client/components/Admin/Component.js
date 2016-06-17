import React, { Component, PropTypes } from 'react'

import { NAV_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import { MENU_WIDTH } from 'c/AuthenticatedLanding/Navigation'
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

    const marginLeft = {
      marginLeft: +NAV_WIDTH + +MENU_WIDTH,
    }

    return (
      <div>
        <section>
          <Navigation location={location} />
          <section
            className={s.content}
            style={marginLeft}
          >
            {content}
          </section>
        </section>
      </div>
    )
  }
}

Admin.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  viewer: PropTypes.shape({
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

export default withStyles(s)(Admin)
