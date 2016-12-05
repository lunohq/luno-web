import React, { Component, PropTypes } from 'react'

import withStyles from 'u/withStyles'

import s from './style.scss'

import Form from './Form'
import Results from './Results'

class ZendeskSearch extends Component {
  handleSearch = ({ query, domain }) => this.props.relay.setVariables({ query, domain })
  render() {
    const { viewer } = this.props
    let result
    if (viewer.zsearch) {
      result = <Results className={s.results} {...viewer.zsearch} />
    }

    return (
      <div className={s.root}>
        <Form onSubmit={this.handleSearch} />
        {result}
      </div>
    )
  }
}

ZendeskSearch.propTypes = {
  relay: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(ZendeskSearch)
