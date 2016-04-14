import React, { PropTypes } from 'react';

import LogoutIcon from '../LogoutIcon';
import MessagesIcon from '../MessagesIcon';
import QuestionAnswerIcon from '../QuestionAnswerIcon';

const Navigation = ({ onLogout }) => {
  const isSelected = (path) => {
    return window.location.pathname === path ? 'selected' : '';
  };

  return (
    <nav className='col left-nav between-xs'>
      <div className='top-buttons col middle-xs'>
        <a className={`nav-button ${isSelected('/')}`} href='/'>
          <QuestionAnswerIcon />
        </a>
        <a className={`nav-button ${isSelected('/message-logs')}`} href='/message-logs'>
          <MessagesIcon />
        </a>
      </div>
      <div className='bottom-buttons col middle-xs'>
        <a className='nav-button' onClick={onLogout}>
          <LogoutIcon />
        </a>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Navigation;
