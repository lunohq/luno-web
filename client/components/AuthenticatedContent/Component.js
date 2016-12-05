import React, { PropTypes } from 'react'

import withStyles from 'u/withStyles'

import DocumentTitle from 'c/DocumentTitle'
import Divider from 'c/Divider/Component'
import SectionTitle from 'c/SectionTitle/Component'
import { NAV_WIDTH } from 'c/AuthenticatedLanding/Navigation'

import s from './style.scss'

const marginLeft = { marginLeft: NAV_WIDTH }

const AuthenticatedContent = ({ children, title }) => (
  <DocumentTitle title={title}>
    <div className={s.content} style={marginLeft}>
      <div className={s.title}>
        <SectionTitle title={title} />
        <Divider />
      </div>
      {children}
    </div>
  </DocumentTitle>
)

AuthenticatedContent.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
}

export default withStyles(s)(AuthenticatedContent)
