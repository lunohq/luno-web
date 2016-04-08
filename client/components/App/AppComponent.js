import React from 'react';
import IconButton from 'material-ui/lib/icon-button';
import { Link } from 'react-router';

import './App.scss';

import Footer from '../Footer/FooterContainer';
import MessagesIcon from '../Icon/MessagesIcon';
import SettingsIcon from '../Icon/SettingsIcon';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    viewer: React.PropTypes.object.isRequired
  };

  appContainer() {
    // TODO: Check whether user is authenticated or not
    if (window.location.pathname === '/') {
      return (
        <div className='landing'>
          <div className='greeting'>
            <h1>Luno</h1>
            <p>Focus on what matters and leave the rest to Luno.</p>
            <Link to='/smart-answers'>
              <img
                alt='Add to Slack'
                height='40'
                width='139'
                src='https://platform.slack-edge.com/img/add_to_slack.png'
                srcSet='https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x'
              />
            </Link>
          </div>
          <div className='content'>
            {this.props.children}
          </div>
          <Footer viewer={this.props.viewer} />
        </div>
      );
    }

    return (
      <div className='app'>
        <section className='row content-container'>
          <nav className='col left-nav between-xs'>
            <div className='top-buttons col middle-xs'>
              <IconButton>
                <MessagesIcon />
              </IconButton>
            </div>
            <div className='bottom-buttons col middle-xs'>
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </div>
          </nav>
          <main className='row col-xs content'>
            {this.props.children}
          </main>
        </section>
      </div>
    );
  }


  render() {
    return this.appContainer();
  }
}

