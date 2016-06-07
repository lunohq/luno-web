import Relay from 'react-relay'

import Component from './Component'

import DeleteUserMutation from 'm/DeleteUserMutation'
import InviteUserMutation from 'm/InviteUserMutation'
import UpdateUserMutation from 'm/UpdateUserMutation'

export default Relay.createContainer(Component, {
  initialVariables: {
    limit: -1 >>> 1,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        team {
          id
          staff(first: $limit) {
            edges {
              node {
                ${DeleteUserMutation.getFragment('user')}
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
                ${InviteUserMutation.getFragment('member')}
                id
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
