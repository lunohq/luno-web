import React, { Component, PropTypes } from 'react'

import withStyles from 'u/withStyles'
import t from 'u/gettext'

import SearchBar from 'c/SearchBar/Component'

import Summary from './Summary'
import Results from './Results'

import s from './style.scss'

class Search extends Component {

  handleSearch = query => this.props.relay.setVariables({ query })

  render() {
    const { viewer } = this.props
    let summary
    if (viewer.msearch) {
      summary = (
        <div className={s.summary}>
          <div>{t(`Search Tokens: ${viewer.msearch.analyzed}`)}</div>
          <div>{t(`Total Request Took: ${viewer.msearch.requestTook}ms`)}</div>
        </div>
      )
    }

    const tierSummaries = []
    const tiers = []
    if (viewer.msearch && viewer.msearch.responses) {
      viewer.msearch.responses.forEach((response, index) => {
        tierSummaries.push(
          <div className={s.tierSummary} key={index}>
            {t(`Tier ${index + 1} Results: ${response.totalResults}`)}
          </div>
        )
        tiers.push(
          <section className={s.tier} key={index}>
            <span className={s.tierTitle}>{t(`Tier ${index + 1}`)}</span>
            <hr />
            <Summary {...response} />
            <Results className={s.results} results={response.results} />
          </section>
        )
      })
    }

    let tierSummary
    if (tierSummaries.length) {
      tierSummary = (
        <section className={s.tierSummary}>
          {tierSummaries}
        </section>
      )
    }

    return (
      <div>
        <SearchBar onChange={this.handleSearch} />
        <section className={s.content}>
          {summary}
          {tierSummary}
          {tiers}
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
