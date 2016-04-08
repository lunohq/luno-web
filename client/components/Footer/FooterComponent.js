import React from 'react';
import { Footer as MDLFooter, FooterSection } from 'react-mdl';
import './Footer.scss';

export default class Footer extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
  };

  render() {
    return (
      <MDLFooter size='mini'>
        <FooterSection type='middle'>
          <span>Handcrafted with ♥ in San Francisco</span>
        </FooterSection>
      </MDLFooter>
    );
  }
}
