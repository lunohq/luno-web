import Relay from 'react-relay';
import Component from './Component';

export default Relay.createContainer(Component, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        bots {
          edges {
            node {
              answers {
                edges {
                  node {
                    id
                    title
                    body
                  }
                }
              }
            }
          }
        }
      }`,
  }
});
