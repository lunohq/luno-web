import Relay from 'react-relay';
import Component from './Component';

import CreateAnswerMutation from '../../mutations/CreateAnswerMutation';
import DeleteAnswerMutation from '../../mutations/DeleteAnswerMutation';

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
              ${CreateAnswerMutation.getFragment('bot')}
              answers(first: $limit) {
                edges {
                  node {
                    ${DeleteAnswerMutation.getFragment('answer')}
                    id
                    title
                    body
                  }
                }
              }
            }
          }
        }
      }
    `,
  },

});
