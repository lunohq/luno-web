import Relay from 'react-relay'

export default class UpdateBotPurposeMutation extends Relay.Mutation {
  static fragments = {
    bot: () => Relay.QL`
      fragment on Bot {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { updateBotPurpose }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateBotPurposePayload {
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
    const { bot: { id }, purpose } = this.props
    return {
      id,
      purpose,
    }
  }

  getOptimisticResponse() {
    const { bot: { id }, purpose } = this.props
    return {
      bot: {
        id,
        purpose
      }
    }
  }
}
