import Relay from 'react-relay'
import Component from './Component'

import Analyze from 'c/Analyze/Container'
import Search from 'c/Search/Container'
import SearchV2 from 'c/SearchV2/Container'
import Explain from 'c/Explain/Container'
import ZendeskSearch from 'c/ZendeskSearch/Container'

export default Relay.createContainer(Component, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        assumed
        ${Analyze.getFragment('viewer')}
        ${Search.getFragment('viewer')}
        ${SearchV2.getFragment('viewer')}
        ${Explain.getFragment('viewer')}
        ${ZendeskSearch.getFragment('viewer')}
      }
    `,
  }
})
