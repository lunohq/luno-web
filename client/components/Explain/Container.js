import Relay from 'react-relay'

import Component from './Component'

export default Relay.createContainer(Component, {
  initialVariables: {
    query: null,
    replyId: null,
    hasArgs: false,
  },

  prepareVariables: prev => ({
    ...prev,
    hasArgs: !!prev.query && !!prev.replyId,
  }),

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        explain(query: $query, replyId: $replyId) @include(if: $hasArgs) {
          matched
          explanation
        }
      }
    `
  },
})
