import Relay from 'react-relay'

export default class DeleteUserMutation extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { updateUser }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user { id }
        team { staff }
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_DELETE',
      parentName: 'team',
      parentID: this.props.teamId,
      connectionName: 'staff',
      deletedIDFieldName: ['user'],
      pathToConnection: ['team', 'staff'],
    }]
  }

  getVariables() {
    const { user: { id } } = this.props
    return {
      id,
      role: 'CONSUMER',
    }
  }

  getOptimisticResponse() {
    const { user: { id } } = this.props
    return {
      user: {
        id,
      },
    }
  }

}
