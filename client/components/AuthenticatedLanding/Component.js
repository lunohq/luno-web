import React, { PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import Navigation from './Navigation'

import s from './style.scss'

const AuthenticatedLanding = ({ children, onLogout }) => (
  <div className={s.root}>
    <section>
      <Navigation onLogout={onLogout} />
      <main className={s.main}>
        {children}
      </main>
    </section>
  </div>
)

AuthenticatedLanding.propTypes = {
  children: PropTypes.node,
  onLogout: PropTypes.func,
}

export default withStyles(s)(AuthenticatedLanding)
