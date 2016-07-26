import React, { Component, PropTypes } from 'react'

import withStyles from 'u/withStyles'

import SearchBar from 'c/SearchBar/Component'

import Summary from './Summary'
import Results from './Results'

import s from './style.scss'

class Search extends Component {

  handleSearch = query => this.props.relay.setVariables({ query })

  render() {
    const { viewer } = this.props
    let summary
    if (viewer.searchV2) {
      summary = <Summary className={s.summary} {...viewer.searchV2} />
    }

    let results
    if (viewer.searchV2 && viewer.searchV2.results) {
      results = <Results className={s.results} results={viewer.searchV2.results} />
    }

    return (
      <div>
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
