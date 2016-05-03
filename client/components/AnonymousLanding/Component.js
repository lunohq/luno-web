import React from 'react'

import DocumentTitle from '../DocumentTitle'

import './style.scss'

const AnonymousLanding = () => (
  <DocumentTitle title='Login to your Luno'>
    <div className='landing'>
      <div className='navbar navbar-default navbar-fixed-top'>
        <div className='container'>
          <div className='col-xs-6'>
            <a className='navbar-brand' href='#'>luno</a>
          </div>
        </div>
      </div>
      <div classname='container'>
        <div className='row center-xs'>
          <div className='col-xs-12'>
            <h1>Log in to your Slack team</h1>
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

export default AnonymousLanding
