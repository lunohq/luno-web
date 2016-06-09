import React from 'react'

import withStyles from 'u/withStyles'
import t from 'u/gettext'

import BrandedContainer from 'c/BrandedContainer/Component'

import s from './style.scss'

const AnonymousLanding = () => (
  <BrandedContainer title={t('Login to your Luno')}>
    <div className={s.container}>
      <div className={s.headerContainer}>
        <h1 className={s.header}>{t('Open your Luno dashboard')}</h1>
      </div>
      <a href='/login'>
        <img
          alt='Sign in with Slack'
          height='60'
          style={{ marginTop: '40px', marginBottom: '40px' }}
          src={require('../../assets/sign-in-with-slack-button.png')}
        />
      </a>
    </div>
  </BrandedContainer>
)

export default withStyles(s)(AnonymousLanding)
