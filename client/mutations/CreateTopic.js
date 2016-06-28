import Relay from 'react-relay'

export default class CreateTopic extends Relay.Mutation {

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
    // TODO this should be alphabetized
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'topics',
      edgeName: 'topicEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }]
  }

  getVariables() {
    const { name } = this.props
    return { name, pointsOfContact: [] }
  }

}
