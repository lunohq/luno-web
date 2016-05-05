import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import DocumentTitle from '../DocumentTitle'

import s from './style.scss'

const AnonymousLanding = () => (
  <DocumentTitle title='Login to your Luno'>
    <div className={s.root}>
      <div className={s.container}>
        <div>
          <div className={s.header}>
            <div className={s.brandContainer}>
              <a className={s.brand} href='#'>luno</a>
            </div>
          </div>
        </div>
        <div className={s.content}>
          <div className={s.loginContainer}>
            <h1 className={s.title}>Log in to your Slack team</h1>
            <a href='/login'>
              <img
                alt='Add to Slack'
                height='60'
                style={{ marginTop: '40px', marginBottom: '40px' }}
                src={require('../../assets/add-to-slack-button.png')}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </DocumentTitle>
)

export default withStyles(s)(AnonymousLanding)
