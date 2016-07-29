import Relay from 'react-relay'
import Component from './Component'

import CreateTopic from 'm/CreateTopic'
import UpdateTopic from 'm/UpdateTopic'
import DeleteTopic from 'm/DeleteTopic'
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
        ${DeleteTopic.getFragment('viewer')}
        defaultTopic {
          ${UpdateReply.getFragment('topic')}
          ${UpdateReply.getFragment('previousTopic')}
          ${DeleteReply.getFragment('topic')}
          id
          replies(first: $limit) {
            edges {
              node {
                ${DeleteReply.getFragment('reply')}
                ${UpdateReply.getFragment('reply')}
                id
                title
                body
                keywords
                changed
                attachments {
                  file {
                    name
                    created
                  }
                }
                updatedBy {
                  username
                }
              }
            }
          }
        }

        topics(first: $limit) {
          edges {
            node {
              ${UpdateReply.getFragment('topic')}
              ${UpdateReply.getFragment('previousTopic')}
              ${DeleteTopic.getFragment('topic')}
              ${UpdateTopic.getFragment('topic')}
              ${DeleteReply.getFragment('topic')}
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
                    keywords
                    changed
                    attachments {
                      file {
                        name
                        created
                      }
                    }
                    updatedBy {
                      username
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  },

})
