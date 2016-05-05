import Relay from 'react-relay'

export default class UpdateBotPointsOfContactMutation extends Relay.Mutation {
  static fragments = {
    bot: () => Relay.QL`
      fragment on Bot {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { updateBotPointsOfContact }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateBotPointsOfContactPayload {
        bot
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        bot: this.props.bot.id,
      }
    }]
  }

  getVariables() {
    const { bot: { id }, pointsOfContact } = this.props
    return {
      id,
      pointsOfContact,
    }
  }

  getOptimisticResponse() {
    const { bot: { id }, pointsOfContact } = this.props
    return {
      bot: {
        id,
        pointsOfContact,
      }
    }
  }
}
