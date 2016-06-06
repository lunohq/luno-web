import Relay from 'react-relay'

import Component from './Component'

export default Relay.createContainer(Component, {
  initialVariables: {
    limit: -1 >>> 1,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        team {
          users(first: $limit) {
            edges {
              node {
                id
                username
                displayRole
              }
            }
          }
          members(first: $limit) {
            edges {
              node {
                userId
                name
                profile {
                  realName
                }
              }
            }
          }
        }
      }
    `,
  },
})
