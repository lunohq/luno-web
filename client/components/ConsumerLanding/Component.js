import React, { PropTypes } from 'react'

import RaisedButton from 'material-ui/RaisedButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import BrandedContainer from 'c/BrandedContainer/Component'

import s from './style.scss'

const ConsumerLanding = ({ onLogout, viewer }) => {
  const { team: { admins: { edges: admins } } } = viewer
  const formattedAdmins = admins.map(({ node: { username } }) => `@${username}`).join(', ')
  // TODO should be pulling the actual bot name
  const botName = '@luno'
  return (
    <BrandedContainer>
      <div className={s.container}>
        <div className={s.headerContainer}>
          <h1 className={s.header}>{t('Sorry, you don\'t have access to Luno.')}</h1>
          <h2 className={s.subheader}>{t(`We've already let your Luno admins (${formattedAdmins}) know that you want to help train ${botName}, but feel free to bug them directly.`)}</h2>
          <div className={s.buttonContainer}>
            <RaisedButton className={s.button} label={t('Try Again')} onTouchTap={onLogout} />
          </div>
        </div>
      </div>
    </BrandedContainer>
  )
}

ConsumerLanding.propTypes = {
  onLogout: PropTypes.func.isRequired,
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(ConsumerLanding)
