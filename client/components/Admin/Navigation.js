import React, { Component, PropTypes } from 'react'
import Drawer from 'material-ui/Drawer'
import { ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import t from 'u/gettext'

import { NAV_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import { MENU_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import SelectableList from 'c/SelectableList'

class Navigation extends Component {

  handleBotTouchTap = () => this.context.router.push('/admin/bot')
  handleUsersTouchTap = () => this.context.router.push('/admin/users')

  render() {
    const { location: { pathname } } = this.props
    return (
      <Drawer
        containerStyle={{ left: NAV_WIDTH }}
        width={MENU_WIDTH}
      >
        <SelectableList defaultValue={pathname}>
          <Subheader>{t('Admin Settings')}</Subheader>
          <ListItem
            onTouchTap={this.handleBotTouchTap}
            primaryText={t('Lunobot Settings')}
            value='/admin/bot'
          />
          <ListItem
            onTouchTap={this.handleUsersTouchTap}
            primaryText={t('Manage Users')}
            value='/admin/users'
          />
        </SelectableList>
      </Drawer>
    )
  }

}

Navigation.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}

Navigation.contextTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default Navigation
