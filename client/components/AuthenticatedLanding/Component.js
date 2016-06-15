import React, { PropTypes } from 'react'
import Snackbar from 'material-ui/Snackbar'

import withStyles from 'u/withStyles'
import Navigation from './Navigation'

import s from './style.scss'

const AuthenticatedLanding = ({ children, onLogout, viewer }) => {
  let assumeNotification
  if (viewer.assumed) {
    assumeNotification = (
      <Snackbar
        open
        message={`Viewing as ${viewer.username} in ${viewer.team.name}`}
        action='end'
        onActionTouchTap={onLogout}
        onRequestClose={() => {}}
        style={{ zIndex: 0 }}
      />
    )
  }

  return (
    <div className={s.root}>
      <Navigation
        isAdmin={viewer.isAdmin}
        onLogout={onLogout}
        team={viewer.team}
      />
      <main className={s.main}>
        {children}
        {assumeNotification}
      </main>
    </div>
  )
}

AuthenticatedLanding.propTypes = {
  children: PropTypes.node,
  onLogout: PropTypes.func,
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(AuthenticatedLanding)
