import Relay from 'react-relay'

import Component from './Component'

export default Relay.createContainer(Component, {
  initialVariables: {
    query: null,
    domain: null,
    hasArgs: false,
  },

  prepareVariables: prev => ({
    ...prev,
    hasArgs: !!prev.query && !!prev.domain,
  }),

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        zsearch(query: $query, domain: $domain) @include(if: $hasArgs) {
          requestTook
          totalResults
          results {
            title
            labels
            url
          }
        }
      }
    `
  },
})
