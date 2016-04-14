import React, { PropTypes } from 'react';

import DocumentTitle from '../DocumentTitle';
import LogoutIcon from '../LogoutIcon';
import MessagesIcon from '../MessagesIcon';
import QuestionAnswerIcon from '../QuestionAnswerIcon';

import './style.scss';

const AuthenticatedLanding = ({ children, onLogout }) => (
  <DocumentTitle title='Smart answers'>
    <div className='app'>
      <section className='row content-container'>
        <nav className='col left-nav between-xs'>
          <div className='top-buttons col middle-xs'>
            <a className='nav-button' href='/'>
              <QuestionAnswerIcon />
            </a>
            <a className='nav-button' href='/message-logs'>
              <MessagesIcon />
            </a>
          </div>
          <div className='bottom-buttons col middle-xs'>
            <a className='nav-button' onClick={onLogout}>
              <LogoutIcon />
            </a>
          </div>
        </nav>
        <main className='row col-xs content'>
          {children}
        </main>
      </section>
    </div>
  </DocumentTitle>
);

AuthenticatedLanding.propTypes = {
  children: PropTypes.node,
  onLogout: PropTypes.func,
};

export default AuthenticatedLanding;
