import React, { Component, PropTypes } from 'react'

import withStyles from 'u/withStyles'

import SearchBar from 'c/SearchBar/Component'
import { NAV_WIDTH } from 'c/AuthenticatedLanding/Navigation'

import Summary from './Summary'
import Results from './Results'

import s from './style.scss'

class Search extends Component {

  handleSearch = query => this.props.relay.setVariables({ query })

  render() {
    const { viewer } = this.props
    let summary
    if (viewer.search) {
      summary = <Summary className={s.summary} {...viewer.search} />
    }

    let results
    if (viewer.search && viewer.search.results) {
      results = <Results className={s.results} results={viewer.search.results} />
    }

    return (
      <div style={{ marginLeft: NAV_WIDTH }}>
        <SearchBar onChange={this.handleSearch} />
        <section className={s.content}>
          {summary}
          {results}
        </section>
      </div>
    )
  }

}

Search.propTypes = {
  relay: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(Search)
