import Relay from 'react-relay'

import UpdateBotMutation from '../../mutations/UpdateBotMutation'

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
              ${UpdateBotMutation.getFragment('bot')}
              id
              purpose
              pointsOfContact
            }
          }
        }
      }
    `,
  },

})
