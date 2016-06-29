import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer'

import withStyles from 'u/withStyles'
import QuestionAnswerIcon from 'c/QuestionAnswerIcon'
import AccountMenu from './AccountMenu'

import s from './nav-style.scss'

export const NAV_WIDTH = 60
export const MENU_WIDTH = 200

const Navigation = ({ isAdmin, isAssumed, onLogout }) => {
  const isSelected = (path, fuzzy) => {
    if (fuzzy) {
      return window.location.pathname.startsWith(path) ? s.selectedButton : s.button
    }
    return window.location.pathname === path ? s.selectedButton : s.button
  }

  let drawerContainerStyle
  if (isAssumed) {
    drawerContainerStyle = { background: '#ff0000', boxShadow: 'none' }
  } else {
    drawerContainerStyle = { background: '#393F44', boxShadow: 'none' }
  }

  return (
    <Drawer
      containerStyle={drawerContainerStyle}
      width={NAV_WIDTH}
    >
      <div className={s.container}>
        <div className={s.topButtons}>
          <Link className={isSelected('/knowledge', true)} to='/knowledge'>
            <QuestionAnswerIcon />
          </Link>
        </div>
        <div className={s.buttons}>
          <AccountMenu
            className={isSelected('/admin', true)}
            isAdmin={isAdmin}
            onLogout={onLogout}
          />
        </div>
      </div>
    </Drawer>
  )
}

Navigation.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isAssumed: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
}

export default withStyles(s)(Navigation)
