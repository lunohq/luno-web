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
        search(query: $query) @include(if: $hasQuery) {
          query
          took
          requestTook
          totalResults
          maxScore
          results {
            score
            displayTitle
            title
            id
            body
            explanation
          }
        }
      }
    `
  },
})
