import React from 'react'

import DocumentTitle from '../DocumentTitle'

import './style.scss'

const AnonymousLanding = () => (
  <DocumentTitle title='Login to your Luno'>
    <div className='landing'>
      <div className='container'>
        <div className="header row">
          <div className='col-xs-6'>
            <a className='brand' href='#'>luno</a>
          </div>
        </div>
      </div>
      <div className='content container'>
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
