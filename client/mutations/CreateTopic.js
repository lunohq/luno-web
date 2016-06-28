import Relay from 'react-relay'

export default class CreateTopic extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { createTopic }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateTopicPayload {
        viewer { topics }
        topicEdge
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'topics',
      edgeName: 'topicEdge',
      rangeBehaviors: {
        '': 'refetch',
      },
    }]
  }

  getVariables() {
    const { name } = this.props
    return { name, pointsOfContact: [] }
  }

}
