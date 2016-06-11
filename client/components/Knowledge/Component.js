import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import DocumentTitle from 'c/DocumentTitle'
import Divider from 'c/Divider/Component'
import SectionTitle from 'c/SectionTitle/Component'
import Navigation from './Navigation'
import Replies from 'c/Replies/Component'

class Knowledge extends Component {
  getBot() {
    const { viewer: { bots } } = this.props
    return bots.edges[0].node
  }

  render() {
    const bot = this.getBot()
    return (
      <DocumentTitle title={t('Knowledge')}>
        <div>
          <Navigation />
          <Replies bot={bot} />
        </div>
      </DocumentTitle>
    )
  }
}

Knowledge.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default Knowledge
