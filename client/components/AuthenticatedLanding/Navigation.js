import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer'

import withStyles from '../../utils/withStyles'
import LogoutIcon from '../LogoutIcon'
import QuestionAnswerIcon from '../QuestionAnswerIcon'
import SettingsIcon from '../SettingsIcon'

import s from './nav-style.scss'

const Navigation = ({ onLogout }) => {
  const isSelected = (path) => {
    return window.location.pathname === path ? s.selectedButton : s.button
  }

  return (
    <Drawer
      containerStyle={{background: '#393F44'}}
      width={60}
    >
      <div className={s.container}>
        <div className={s.topButtons}>
          <Link className={isSelected('/')} to='/'>
            <QuestionAnswerIcon />
          </Link>
          <Link className={isSelected('/bot-settings')} to='/bot-settings'>
            <SettingsIcon />
          </Link>
        </div>
        <div className={s.buttons}>
          <a className={s.button} onClick={onLogout}>
            <LogoutIcon />
          </a>
        </div>
      </div>
    </Drawer>
  )
}

Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
}

export default withStyles(s)(Navigation)
