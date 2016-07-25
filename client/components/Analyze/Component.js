import React, { Component, PropTypes } from 'react'

import withStyles from 'u/withStyles'

import Form from './Form'
import Result from './Result'

import s from './style.scss'

class Analyze extends Component {

  handleAnalyze = ({ query, options }) => this.props.relay.setVariables({ query, options })

  render() {
    const { viewer } = this.props

    let result
    if (viewer.analyze) {
      result = <Result className={s.result} result={viewer.analyze} />
    }

    return (
      <div className={s.root}>
        <Form onSubmit={this.handleAnalyze} />
        {result}
      </div>
    )
  }
}

Analyze.propTypes = {
  relay: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(Analyze)
