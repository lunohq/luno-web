import React from 'react';

import './style.scss';

const AnonymousLanding = () => (
  <div className='landing'>
      <div className='navbar navbar-default navbar-fixed-top'>
        <div className='container'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <a className='navbar-brand' href='#'>luno</a>
          </div>
          <div className='navbar-collapse collapse'>
            <ul className='nav navbar-nav navbar-right'>
              <li><a href='/login'>Sign in</a></li>
            </ul>
          </div>
        </div>
      </div>

    <div id='headerwrap'>
      <div className='container'>
        <div className='row mt centered'>
          <div className='col-lg-8 col-lg-offset-2'>
            <h1>A HELPDESK BOT FOR YOUR<br />SLACK TEAM</h1>
            <h3>Scale yourself &mdash; train your Lunobot to handle common questions for you.</h3>
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

    <div className='container'>
      <div className='row mt centered'>
        <div className='col-lg-8 col-lg-offset-2'>
          <h2>Let your Lunobot field all those common questions that you keep answering over and over again.</h2>
        </div>
        <div style={{ width: '100%' }}>
          <img style={{ marginTop: '40px' }} src={require('../../assets/travel.gif')} />
        </div>
      </div>
    </div>

    <div className='container'>
      <hr />
      <div className='row mt centered'>
        <div className='col-lg-8 col-lg-offset-2'>
          <h2>Launch your Lunobot in less than 15 minutes.</h2>
        </div>
      </div>

      <div className='row centered'>
        <div className='col-lg-4'>
          <h4>
            <img height='22' style={{ marginBottom: '3px' }} src={require('../../assets/emoji-computer.png')} />
             1. Train your Lunobot
          </h4>
          <p>Use the admin webapp to teach him the answers to common HR, IT, and other common FAQs.</p>
        </div>

        <div className='col-lg-4'>
          <h4>
            <img height='22' style={{ marginBottom: '3px' }} src={require('../../assets/emoji-slack.png')} />
             2. /invite @luno
          </h4>
          <p>Invite your Lunobot to your team's dedicated help channel in Slack.</p>
        </div>

        <div className='col-lg-4'>
          <h4>
            <img height='22' style={{ marginBottom: '3px' }} src={require('../../assets/emoji-tropical-drink.png')} />
             3. Kick back and relax
          </h4>
          <p>Watch your Lunobot work. He’ll automatically escalate questions to you if he gets stumped.</p>
        </div>
      </div>

      <div className='row mt centered'>
        <div className='col-lg-8 col-lg-offset-2'>
          <h3>
            <img
              height='28'
              style={{ marginBottom: '3px' }}
              src={require('../../assets/emoji-hand-point-down.png')}
            />
            Now, click this button to get started.
          </h3>
          <a href='/login'>
            <img
              alt='Add to Slack'
              height='60'
              style={{ marginTop: '20px', marginBottom: '20px' }}
              src={require('../../assets/add-to-slack-button.png')}
            />
          </a>
        </div>
      </div>
    </div>
    <div className='container'>
      <hr />
      <p className='centered'>Handcrafted with ❤ in San Francisco. &copy; Luno {(new Date()).getFullYear()}</p>
    </div>
  </div>
);

export default AnonymousLanding;
