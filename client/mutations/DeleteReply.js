import Relay from 'react-relay'

export default class DeleteReply extends Relay.Mutation {
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
  }

  getMutation() {
    return Relay.QL`mutation { deleteReply }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteReplyPayload {
        deletedId
        topic { replies }
      }
    `
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'topic',
      parentID: this.props.topic.id,
      connectionName: 'replies',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables() {
    const { reply: { id }, topic: { id: topicId }, bot: { id: botId } } = this.props
    return {
      id,
      topicId,
      botId,
    }
  }

  getOptimisticResponse() {
    const { reply: { id } } = this.props
    return {
      deletedId: id,
    }
  }

}
