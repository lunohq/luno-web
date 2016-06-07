import React, { PropTypes } from 'react'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './style.scss'

const ConsumerLanding = ({ onLogout }) => (
  <div>
    {t('Consumer view!')}
    <div onTouchTap={onLogout}>{t('Try Again!')}</div>
  </div>
)

ConsumerLanding.propTypes = {
  onLogout: PropTypes.func.isRequired,
}

export default withStyles(s)(ConsumerLanding)
