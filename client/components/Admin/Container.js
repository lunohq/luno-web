import Relay from 'react-relay'
import Component from './Component'

import BotSettingsContainer from 'c/BotSettings/Container'
import ManageUsersContainer from 'c/ManageUsers/Container'

export default Relay.createContainer(Component, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        isAdmin
        ${BotSettingsContainer.getFragment('viewer')}
        ${ManageUsersContainer.getFragment('viewer')}
      }
    `,
  }
})
