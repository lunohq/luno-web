import Relay from 'react-relay'

export default class CreateAnswerMutation extends Relay.Mutation {
  static fragments = {
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
    return Relay.QL`mutation { createAnswer }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateAnswerPayload {
        bot { answers }
        answerEdge
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'bot',
      parentID: this.props.bot.id,
      connectionName: 'answers',
      edgeName: 'answerEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }]
  }

  getVariables() {
    const { title, body, bot: { id: botId }, topic } = this.props
    let topicId
    if (topic) {
      topicId = topic.id
    }
    return {
      body,
      title,
      botId,
      topicId,
    }
  }

}
