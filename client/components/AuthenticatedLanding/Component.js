import React, { PropTypes } from 'react';
import { IconButton } from 'material-ui';

import LogoutIcon from '../LogoutIcon';
import MessagesIcon from '../MessagesIcon';
import QuestionAnswerIcon from '../QuestionAnswerIcon';

import './style.scss';

const AuthenticatedLanding = ({ children }) => (
  <div className='app'>
    <section className='row content-container'>
      <nav className='col left-nav between-xs'>
        <div className='top-buttons col middle-xs'>
          <IconButton href='/answers' linkButton>
            <QuestionAnswerIcon />
          </IconButton>
          <IconButton href='/message-logs' linkButton>
            <MessagesIcon />
          </IconButton>
        </div>
        <div className='bottom-buttons col middle-xs'>
          <IconButton href='/' linkButton>
            <LogoutIcon />
          </IconButton>
        </div>
      </nav>
      <main className='row col-xs content'>
        {children}
      </main>
    </section>
  </div>
);

AuthenticatedLanding.propTypes = {
  children: PropTypes.node,
};

export default AuthenticatedLanding;
