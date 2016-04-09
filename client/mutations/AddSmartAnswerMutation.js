import Relay from 'react-relay';

export default class AddSmartAnswerMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id
        team {
          id
        }
        bots {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{ createAnswer }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateAnswerPayload {
        viewer {
          id
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }];
  }

  getVariables() {
    const {
      title,
      body
    } = this.props;

    const {
      bots,
      team
    } = this.props.viewer;

    return {
      body,
      title,
      botId: bots.edges[0].node.id,
      teamId: team.id,
    };
  }
}
