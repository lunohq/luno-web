import Relay from 'react-relay'
import Component from './Component'

import CreateTopic from 'm/CreateTopic'
import UpdateTopic from 'm/UpdateTopic'
import CreateReply from 'm/CreateReply'
import DeleteReply from 'm/DeleteReply'
import UpdateReply from 'm/UpdateReply'

// TODO should use setVariable to only fetch replies for a specific topic
export default Relay.createContainer(Component, {
  initialVariables: {
    limit: -1 >>> 1,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${CreateTopic.getFragment('viewer')}
        defaultTopic {
          ${CreateReply.getFragment('topic')}
          ${DeleteReply.getFragment('topic')}
          ${UpdateReply.getFragment('topic')}
          id
          replies(first: $limit) {
            edges {
              node {
                ${DeleteReply.getFragment('reply')}
                ${UpdateReply.getFragment('reply')}
                id
                title
                body
                changed
              }
            }
          }
        }

        topics(first: $limit) {
          edges {
            node {
              ${UpdateTopic.getFragment('topic')}
              ${CreateReply.getFragment('topic')}
              ${DeleteReply.getFragment('topic')}
              ${UpdateReply.getFragment('topic')}
              id
              name
              replies(first: $limit) {
                edges {
                  node {
                    ${DeleteReply.getFragment('reply')}
                    ${UpdateReply.getFragment('reply')}
                    id
                    title
                    body
                    changed
                  }
                }
              }
            }
          }
        }

        bots(first: 1) {
          edges {
            node {
              ${CreateReply.getFragment('bot')}
              ${DeleteReply.getFragment('bot')}
              ${UpdateReply.getFragment('bot')}
            }
          }
        }
      }
    `,
  },

})
