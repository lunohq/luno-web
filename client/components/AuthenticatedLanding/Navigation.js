import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer'

import withStyles from 'u/withStyles'
import QuestionAnswerIcon from 'c/QuestionAnswerIcon'
import AccountMenu from './AccountMenu'

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
        </div>
        <div className={s.buttons}>
          <AccountMenu className={s.button} onLogout={onLogout} />
        </div>
      </div>
    </Drawer>
  )
}

Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
}

export default withStyles(s)(Navigation)
