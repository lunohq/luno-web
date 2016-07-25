import React, { PropTypes } from 'react'

import withStyles from 'u/withStyles'

import { NAV_WIDTH, MENU_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import Search from 'c/Search/Container'
import Explain from 'c/Explain/Container'

import Navigation from './Navigation'

import s from './style.scss'

const SearchDashboard = ({ location, params: { slug }, viewer }) => {
  let content
  switch (slug) {
    case 'query':
      content = <Search viewer={viewer} />
      break
    case 'explain':
      content = <Explain viewer={viewer} />
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

SearchDashboard.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(SearchDashboard)
