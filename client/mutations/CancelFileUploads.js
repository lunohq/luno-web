import Relay from 'react-relay'

export default class CancelFileUploads extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { cancelFileUploads }`
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on CancelFileUploadsPayload {
            mutationIds
          }
        `,
      ],
    }]
  }

  getVariables() {
    const { uploads } = this.props
    return {
      uploads: uploads.map(({ file, transaction }) => ({ name: file.name, mutationId: transaction.getID() })),
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CancelFileUploadsPayload {
        mutationIds
      }
    `
  }

}
