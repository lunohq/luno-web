import React, { Component, PropTypes } from 'react'

export default function withForceFetch(WrappedComponent) {
  class ForceFetch extends Component {

    componentWillMount() {
      this.props.relay.forceFetch()
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  ForceFetch.propTypes = {
    relay: PropTypes.object.isRequired,
  }

  return ForceFetch
}
