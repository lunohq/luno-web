import React, { PropTypes } from 'react';
import IconButton from 'material-ui/lib/icon-button';
import { Link } from 'react-router';

import './Style.scss';

import Footer from '../Footer/FooterComponent';
import LogoutIcon from '../LogoutIcon';
import MessagesIcon from '../MessagesIcon';
import QuestionAnswerIcon from '../QuestionAnswerIcon';

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    viewer: PropTypes.object.isRequired,
  };

  getFAQ() {
    const faqs = [
      'how do i setup the office printer?',
      'how can i get access to github?',
      'what is the wifi password?',
      'what is our office address?',
      'where should i file expenses?'
    ];
    return faqs[Math.floor((Math.random() * faqs.length))];
  }

  appContainer() {
    // TODO: Check whether user is authenticated or not
    if (window.location.pathname === '/') {
      return (
        <div className='landing'>
          <div className='greeting col middle-xs center-xs'>
            <img className='logo' height='30px' src={require('../../assets/luno-logo-white.png')} />
            <h1>@luno - {this.getFAQ()}</h1>
            <h4>Luno is your partner in doing great work &mdash; a bot that answers frequenty asked questions.</h4>
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
            <div className='row'>
              <div className='col-xs-6'>
                <h2>Scale your teams</h2>
                <h3>Stop answering repeated questions</h3>
                <p>
                  Train luno like your team member once, add it to your help channels, and it will take care of responding to everyone.
                  You can also teach luno on when to escalate and who would be the right person for a topic.
                </p>
              </div>
              <div className='col-xs-6 interaction-container'>
                <img src={require('../../assets/travel.gif')} />
              </div>
            </div>
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
              <IconButton href='/smart-answers' linkButton>
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

