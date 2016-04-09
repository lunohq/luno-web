import React from 'react';
import { Footer as MDLFooter, FooterSection } from 'react-mdl';
import './style.scss';

const Footer = () => (
  <MDLFooter size='mini'>
    <FooterSection type='middle'>
      <span>Handcrafted with ♥ in San Francisco</span>
    </FooterSection>
  </MDLFooter>
);

export default Footer;
