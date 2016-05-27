import Relay from 'react-relay'
import Component from './Component'

import BotSettingsContainer from '../BotSettings/Container'

export default Relay.createContainer(Component, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${BotSettingsContainer.getFragment('viewer')}
      }
    `,
  }
})
