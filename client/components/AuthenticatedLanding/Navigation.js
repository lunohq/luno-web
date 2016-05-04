import React, { PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import LogoutIcon from '../LogoutIcon'
import QuestionAnswerIcon from '../QuestionAnswerIcon'
import SettingsIcon from '../SettingsIcon'

import s from './style.scss'

const Navigation = ({ onLogout }) => {
  const isSelected = (path) => {
    return window.location.pathname === path ? s.selectedNavButton : s.navButton
  }

  return (
    <nav className={s.nav}>
      <div className={s.topButtons}>
        <a className={isSelected('/')} href='/'>
          <QuestionAnswerIcon />
        </a>
        <a className={isSelected('/bot-settings')} href='/bot-settings'>
          <SettingsIcon />
        </a>
      </div>
      <div className={s.buttons}>
        <a className={s.navButton} onClick={onLogout}>
          <LogoutIcon />
        </a>
      </div>
    </nav>
  )
}

Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
}

export default withStyles(s)(Navigation)
