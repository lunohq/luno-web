import Relay from 'react-relay'

import LogoutMutation from 'm/LogoutMutation'

import Component from './Component'

export default Relay.createContainer(Component, {
  initialVariables: {
    limit: -1 >>> 1,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        anonymous
        assumed
        username
        isAdmin
        isStaff
        team {
          id
          name
          admins(first: $limit) {
            edges {
              node {
                username
              }
            }
          }
        }
        ${LogoutMutation.getFragment('viewer')}
      }
    `
  }
})
