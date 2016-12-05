import Relay from 'react-relay'

import Component from './Component'

export default Relay.createContainer(Component, {
  initialVariables: {
    query: null,
    replyId: null,
    tier: null,
    hasArgs: false,
  },

  prepareVariables: prev => ({
    ...prev,
    hasArgs: !!prev.query && !!prev.replyId && !!prev.tier,
  }),

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        explain(query: $query, replyId: $replyId, tier: $tier) @include(if: $hasArgs) {
          matched
          explanation
        }
      }
    `
  },
})
