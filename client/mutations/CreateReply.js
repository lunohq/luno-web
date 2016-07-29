import Relay from 'react-relay'
import { formatAttachments } from './utils'

export default class CreateReply extends Relay.Mutation {

  static fragments = {
    file: () => Relay.QL`
      fragment on File {
        id
        name
        permalink
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { createReply }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateReplyPayload {
        topic { replies }
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'topic',
      parentID: this.props.topic.id,
      connectionName: 'replies',
      edgeName: 'replyEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }]
  }

  getVariables() {
    const { attachments, title, body, keywords, topic: { id: topicId } } = this.props
    return {
      body,
      keywords,
      title,
      topicId,
      attachments: formatAttachments(attachments),
    }
  }
}
