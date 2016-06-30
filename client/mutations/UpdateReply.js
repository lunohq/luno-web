import Relay from 'react-relay'

export default class UpdateReply extends Relay.Mutation {
  static fragments = {
    reply: () => Relay.QL`
      fragment on Reply {
        id
      }
    `,
    bot: () => Relay.QL`
      fragment on Bot {
        id
      }
    `,
    topic: () => Relay.QL`
      fragment on Topic {
        id
      }
    `,
    previousTopic: () => Relay.QL`
      fragment on Topic {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { updateReply }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateReplyPayload {
        reply
        topic
        previousTopic
      }
    `
  }

  getConfigs() {
    const { reply, previousTopic, topic } = this.props
    const configs = [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        reply: reply.id,
      }
    }]

    if (topic.id !== previousTopic.id) {
      configs.push({
        type: 'NODE_DELETE',
        parentName: 'previousTopic',
        parentID: previousTopic.id,
        connectionName: 'replies',
        deletedIDFieldName: 'replyId',
      })
      configs.push({
        type: 'RANGE_ADD',
        parentName: 'topic',
        parentID: topic.id,
        connectionName: 'replies',
        edgeName: 'replyEdge',
        rangeBehaviors: {
          '': 'prepend',
        },
      })
    }
    return configs
  }

  getVariables() {
    const {
      reply: { id },
      previousTopic: { id: previousTopicId },
      topic: { id: topicId },
      title,
      body,
      bot: { id: botId },
    } = this.props
    return {
      body,
      id,
      title,
      topicId,
      previousTopicId,
      botId,
    }
  }

}

