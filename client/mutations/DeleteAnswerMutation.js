import Relay from 'react-relay';

export default class DeleteAnswerMutation extends Relay.Mutation {
  static fragments = {
    answer: () => Relay.QL`
      fragment on Answer {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { deleteAnswer }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteAnswerPayload {
        deletedId
        bot { answers }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'bot',
      parentID: this.props.bot.id,
      connectionName: 'answers',
      deletedIDFieldName: 'deletedId',
    }];
  }

  getVariables() {
    const { answer: { id } } = this.props;
    return {
      id,
    };
  }

  getOptimisticResponse() {
    const { answer: { id } } = this.props;
    return {
      deletedId: id,
    };
  }

}
