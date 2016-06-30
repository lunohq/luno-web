import Relay from 'react-relay'

export default class DeleteTopic extends Relay.Mutation {
  static fragments = {
    topic: () => Relay.QL`
      fragment on Topic {
        id
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { deleteTopic }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteTopicPayload {
        deletedId
        viewer { topics }
      }
    `
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'topics',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables() {
    const { topic: { id } } = this.props
    return { id }
  }

  getOptimisticResponse() {
    const { topic: { id } } = this.props
    return {
      deletedId: id,
    }
  }

}
