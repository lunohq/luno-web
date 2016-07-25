import Relay from 'react-relay'
import Component from './Component'

import Search from 'c/Search/Container'
import Explain from 'c/Explain/Container'

export default Relay.createContainer(Component, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${Search.getFragment('viewer')}
        ${Explain.getFragment('viewer')}
      }
    `,
  }
})
