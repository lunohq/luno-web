import Relay from 'react-relay'

import Component from './Component'

export default Relay.createContainer(Component, {
  initialVariables: {
    limit: -1 >>> 1,
    pageSize: 20,
    threadId: null,
    hasThread: false,
    threadLogs: 20,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        threadLog(id: $threadId) @include(if: $hasThread) {
          events(first: $limit) {
            edges {
              node {
                created
                type
                meta
                message {
                  text
                  ts
                  user
                }
              }
            }
          }
        }

        threadLogs(first: $threadLogs) {
          edges {
            node {
              id
              channelName
              created
              username
              message
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
  },

})
