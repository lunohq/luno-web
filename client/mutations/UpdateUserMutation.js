import Relay from 'react-relay'

export default class UpdateUserMutation extends Relay.Mutation {
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
        user
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }]
  }

  getVariables() {
    const { user: { id }, role } = this.props
    return {
      id,
      role,
    }
  }

}
