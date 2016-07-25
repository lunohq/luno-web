import Relay from 'react-relay'

export default class CreateReply extends Relay.Mutation {
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
    const { title, body, keywords, topic: { id: topicId } } = this.props
    return {
      body,
      keywords,
      title,
      topicId,
    }
  }
}
