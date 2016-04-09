import React from 'react';
import { Link } from 'react-router';

import './style.scss';
import Footer from '../Footer/Component';

// TODO: would try and use more semantic HTML (ie. <section>, <header> etc.)
// TODO: should have some gettext equivalent
//

function getFAQ() {
  const faqs = [
    'how do i setup the office printer?',
    'how can i get access to github?',
    'what is the wifi password?',
    'what is our office address?',
    'where should i file expenses?'
  ];
  return faqs[Math.floor((Math.random() * faqs.length))];
}

const AnonymousLanding = () => (
  <div className='landing'>
    <div className='greeting col middle-xs center-xs'>
      <img className='logo' height='30px' src={require('../../assets/luno-logo-white.png')} />
      <h1>@luno - {getFAQ()}</h1>
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
    <Footer />
  </div>
);

export default AnonymousLanding;
