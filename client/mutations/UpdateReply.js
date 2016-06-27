import Relay from 'react-relay'

export default class UpdateReply extends Relay.Mutation {
  static fragments = {
    reply: () => Relay.QL`
      fragment on Reply {
        id
      }
    `,
    topic: () => Relay.QL`
      fragment on Topic {
        id
      }
    `,
    bot: () => Relay.QL`
      fragment on Bot {
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
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        reply: this.props.reply.id,
      }
    }]
  }

  getVariables() {
    const { reply: { id }, topic: { id: topicId }, title, body, bot: { id: botId } } = this.props
    return {
      body,
      id,
      title,
      topicId,
      botId,
    }
  }

}

