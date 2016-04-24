import Relay from 'react-relay'

export default class LogoutMutation extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  }

  getVariables() {}

  getMutation() {
    return Relay.QL`mutation { logout }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LogoutPayload {
        viewer
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }]
  }

}
