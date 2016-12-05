import Relay from 'react-relay'

import Component from './Component'

export default Relay.createContainer(Component, {
  initialVariables: {
    query: null,
    hasQuery: false,
  },

  prepareVariables: prev => ({
    ...prev,
    hasQuery: !!prev.query,
  }),

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        msearch(query: $query) @include(if: $hasQuery) {
          analyzed
          requestTook
          responses {
            took
            totalResults
            maxScore
            results {
              score
              title
              keywords
              topic
              id
              body
              explanation
            }
          }
        }
      }
    `
  },
})
