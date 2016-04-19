import React, { PropTypes } from 'react';

import LogoutIcon from '../LogoutIcon';
import QuestionAnswerIcon from '../QuestionAnswerIcon';
import SettingsIcon from '../SettingsIcon';

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
        <a className={`nav-button ${isSelected('/bot-settings')}`} href='/bot-settings'>
          <SettingsIcon />
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
