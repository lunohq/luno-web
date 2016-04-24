import React, { PropTypes } from 'react'

import Navigation from './Navigation'

import './style.scss'

const AuthenticatedLanding = ({ children, onLogout }) => (
  <div className='app'>
    <section className='row content-container'>
      <Navigation onLogout={onLogout} />
      <main className='row col-xs content'>
        {children}
      </main>
    </section>
  </div>
)

AuthenticatedLanding.propTypes = {
  children: PropTypes.node,
  onLogout: PropTypes.func,
}

export default AuthenticatedLanding
