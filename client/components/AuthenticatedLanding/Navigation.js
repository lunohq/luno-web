import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer'

import withStyles from 'u/withStyles'
import QuestionAnswerIcon from 'c/QuestionAnswerIcon'
import AccountMenu from './AccountMenu'

import s from './nav-style.scss'

export const NAV_WIDTH = 60

const Navigation = ({ isAdmin, onLogout }) => {
  const isSelected = (path, fuzzy) => {
    if (fuzzy) {
      return window.location.pathname.startsWith(path) ? s.selectedButton : s.button
    }
    return window.location.pathname === path ? s.selectedButton : s.button
  }

  return (
    <Drawer
      containerStyle={{ background: '#393F44', boxShadow: 'none' }}
      width={NAV_WIDTH}
    >
      <div className={s.container}>
        <div className={s.topButtons}>
          <Link className={isSelected('/knowledge')} to='/knowledge'>
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
  onLogout: PropTypes.func.isRequired,
}

export default withStyles(s)(Navigation)
