import Relay from 'react-relay'

import Component from './Component'

import UpdateUserMutation from 'm/UpdateUserMutation'

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
                ${UpdateUserMutation.getFragment('user')}
                id
                username
                displayRole
                role
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
