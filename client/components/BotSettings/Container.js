import Relay from 'react-relay'

import UpdateBotPurposeMutation from '../../mutations/UpdateBotPurposeMutation'
import UpdateBotPointsOfContactMutation from '../../mutations/UpdateBotPointsOfContactMutation'

import Component from './Component'

export default Relay.createContainer(Component, {
  initialVariables: {
    limit: -1 >>> 1,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        bots(first: 1) {
          edges {
            node {
              ${UpdateBotPurposeMutation.getFragment('bot')}
              ${UpdateBotPointsOfContactMutation.getFragment('bot')}
              id
              purpose
              pointsOfContact
            }
          }
        }
        team {
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
