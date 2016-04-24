import Relay from 'react-relay'

import AppComponent from './Component'

import LogoutMutation from '../../mutations/LogoutMutation'

export default Relay.createContainer(AppComponent, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        anonymous
        ${LogoutMutation.getFragment('viewer')}
      }
    `
  }
})
