import React, { Component, PropTypes } from 'react'

import withStyles from 'u/withStyles'

import Form from './Form'
import Result from './Result'

import s from './style.scss'

class Explain extends Component {

  handleExplain = ({ query, replyId, tier }) => this.props.relay.setVariables({ query, replyId, tier: parseInt(tier, 10) })

  render() {
    const { viewer } = this.props

    let result
    if (viewer.explain) {
      result = <Result className={s.result} result={viewer.explain} />
    }

    return (
      <div className={s.root}>
        <Form onSubmit={this.handleExplain} />
        {result}
      </div>
    )
  }
}

Explain.propTypes = {
  relay: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
}

export default withStyles(s)(Explain)
