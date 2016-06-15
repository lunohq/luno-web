import React, { Component, PropTypes } from 'react'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'

import t from 'u/gettext'

import AccountCircleIcon from '../AccountCircleIcon'

class AccountMenu extends Component {

  state = {
    open: false,
  }

  handleTouchTap = (event) => {
    event.preventDefault()
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.close()
  }

  handleSettingsTouchTap = () => {
    this.close()
    this.context.router.push('/admin/bot')
  }

  handleLogoutTouchTap = () => {
    this.close()
    this.props.onLogout()
  }

  close = () => {
    this.setState({ open: false })
  }


  render() {
    const { className, onLogout, isAdmin } = this.props
    const { viewer: { team } } = this.context
    return (
      <a className={className} onTouchTap={this.handleTouchTap}>
        <AccountCircleIcon />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            {(() => !isAdmin ? null : (
              <MenuItem onTouchTap={this.handleSettingsTouchTap} primaryText={t('Admin Settings')} />
            ))()}
            <MenuItem onTouchTap={onLogout} primaryText={t(`Sign Out (${team.name})`)} />
          </Menu>
        </Popover>
      </a>
    )
  }
}

AccountMenu.contextTypes = {
  router: PropTypes.object.isRequired,
  viewer: PropTypes.shape({
    isAdmin: PropTypes.bool.isRequired,
    team: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

AccountMenu.propTypes = {
  className: PropTypes.string,
  isAdmin: PropTypes.bool,
  onLogout: PropTypes.func.isRequired,
}

export default AccountMenu
