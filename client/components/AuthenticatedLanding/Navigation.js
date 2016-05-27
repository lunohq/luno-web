import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import withStyles from '../../utils/withStyles'
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
        <Link className={isSelected('/')} to='/'>
          <QuestionAnswerIcon />
        </Link>
        <Link className={isSelected('/bot-settings')} to='/bot-settings'>
          <SettingsIcon />
        </Link>
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
