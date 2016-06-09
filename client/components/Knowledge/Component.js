import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import DocumentTitle from 'c/DocumentTitle'
import Divider from 'c/Divider/Component'
import SectionTitle from 'c/SectionTitle/Component'
import Navigation from './Navigation'
import Topics from 'c/Topics/Component'

import s from './style.scss'

class Knowledge extends Component {

  render() {
    return (
      <DocumentTitle title={t('Knowledge')}>
        <div>
          <Navigation />
          <Topics />
        </div>
      </DocumentTitle>
    )
  }
}

Knowledge.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(Knowledge)
