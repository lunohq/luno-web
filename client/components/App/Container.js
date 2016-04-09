import Relay from 'react-relay';

import AppComponent from './Component';

export default Relay.createContainer(AppComponent, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        team {
          id
          domain
        }
      }
    `
  }
});
