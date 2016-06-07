import Relay from 'react-relay'

export default class InviteUserMutation extends Relay.Mutation {

  static fragments = {
    member: () => Relay.QL`
      fragment on SlackMember {
        userId
        name
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { inviteUser }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on InviteUserPayload {
        team { staff }
        userEdge
        user
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'team',
        parentID: this.props.teamId,
        connectionName: 'staff',
        edgeName: 'userEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          user: this.props.member.userId,
        },
      },
    ]
  }

  getVariables() {
    const { member: { userId, name: username }, role } = this.props
    return {
      userId,
      role,
      username,
    }
  }

}
