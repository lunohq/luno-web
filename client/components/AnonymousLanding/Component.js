import React from 'react'

import withStyles from 'u/withStyles'
import t from 'u/gettext'
import DocumentTitle from 'c/DocumentTitle'

import s from './style.scss'

const AnonymousLanding = () => (
  <DocumentTitle title='Login to your Luno'>
    <div className={s.root}>
      <div className={s.container}>
        <div>
          <div className={s.header}>
            <div className={s.brandContainer}>
              <a className={s.brand} href='https://www.lunohq.com'>luno</a>
            </div>
          </div>
        </div>
        <div className={s.content}>
          <div className={s.loginContainer}>
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
        </div>
      </div>
    </div>
  </DocumentTitle>
)

export default withStyles(s)(AnonymousLanding)
