import React, { Component, PropTypes } from 'react'

import withStyles from 'u/withStyles'

import { NAV_WIDTH, MENU_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import Search from 'c/Search/Container'
import SearchV2 from 'c/SearchV2/Container'
import Explain from 'c/Explain/Container'
import Analyze from 'c/Analyze/Container'

import Navigation from './Navigation'

import s from './style.scss'

class SearchDashboard extends Component {
  componentWillMount() {
    /* eslint-disable no-undef */
    if (!__ENABLE_SEARCH_DASHBOARD__ && !this.props.viewer.isAssumed) {
    /* eslint-enable no-undef */
      this.context.router.replace('/')
    }
  }

  render() {
    const { location, params: { slug }, viewer } = this.props
    let content
    switch (slug) {
      case 'query':
        content = <Search viewer={viewer} />
        break
      case 'queryV2':
        content = <SearchV2 viewer={viewer} />
        break
      case 'explain':
        content = <Explain viewer={viewer} />
        break
      case 'analyze':
        content = <Analyze viewer={viewer} />
        break
      default:
    }

    const style = {
      marginLeft: NAV_WIDTH + MENU_WIDTH,
    }
    return (
      <div>
        <section>
          <Navigation location={location} />
          <section
            className={s.contnet}
            style={style}
          >
            {content}
          </section>
        </section>
      </div>
    )
  }
}

SearchDashboard.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
}

SearchDashboard.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default withStyles(s)(SearchDashboard)
