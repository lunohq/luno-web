import Relay from 'react-relay'

export default class UpdateAnswerMutation extends Relay.Mutation {
  static fragments = {
    answer: () => Relay.QL`
      fragment on Answer {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { updateAnswer }`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateAnswerPayload {
        answer
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        answer: this.props.answer.id,
      }
    }]
  }

  getVariables() {
    const { answer: { id }, title, body } = this.props
    return {
      body,
      id,
      title,
    }
  }

  getOptimisticResponse() {
    const { answer: { id }, title, body } = this.props
    return {
      answer: {
        body,
        id,
        title,
      }
    }
  }

}
