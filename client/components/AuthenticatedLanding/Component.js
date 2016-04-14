import React, { PropTypes } from 'react';
import { IconButton } from 'material-ui';

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
            <IconButton href='/' linkButton>
              <QuestionAnswerIcon />
            </IconButton>
            <IconButton href='/message-logs' linkButton>
              <MessagesIcon />
            </IconButton>
          </div>
          <div className='bottom-buttons col middle-xs'>
            <IconButton onTouchTap={onLogout}>
              <LogoutIcon />
            </IconButton>
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
