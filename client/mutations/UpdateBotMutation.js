import Relay from 'react-relay';

export default class UpdateBotMutation extends Relay.Mutation {
  static fragments = {
    bot: () => Relay.QL`
      fragment on Bot {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { updateBot }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateBotPayload {
        bot
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        bot: this.props.bot.id,
      }
    }];
  }

  getVariables() {
    const { bot: { id }, pointsOfContact, purpose } = this.props;
    return {
      id,
      pointsOfContact,
      purpose
    };
  }

  getOptimisticResponse() {
    const { bot: { id }, purpose, pointsOfContact } = this.props;
    return {
      bot: {
        id,
        pointsOfContact,
        purpose
      }
    };
  }

}
