import Relay from 'react-relay';

export default class AddSmartAnswerMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
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
          id,
          bots {
            edges {
              node {
                answers {
                  edges {
                    node {
                      id
                      body
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'answers',
      edgeName: 'answerEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }

  getVariables() {
    return {
      title: this.props.title,
      body: this.props.body,
      teamId: this.props.viewer.team.id,
      botId: this.props.viewer.bots.edges[0].node.id,
    };
  }
}
