import Relay from 'react-relay'

export default class UpdateTopic extends Relay.Mutation {
  static fragments = {
    topic: () => Relay.QL`
      fragment on Topic {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { updateTopic }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateTopicPayload {
        topic
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        topic: this.props.topic.id,
      },
    }]
  }

  getVariables() {
    const { topic: { id }, name } = this.props
    return {
      id,
      name,
    }
  }

}
