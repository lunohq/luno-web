import Relay from 'react-relay'

import Component from './Component'

export default Relay.createContainer(Component, {
  initialVariables: {
    query: null,
    options: null,
    hasQuery: false,
  },

  prepareVariables: prev => ({
    ...prev,
    hasQuery: !!prev.query,
  }),

  fragments: {
    viewer: () => Relay.QL`
      fragments on User {
        analyze(query: $query, options: $options) @include(if: $hasQuery) {
          result
        }
      }
    `
  },
})
