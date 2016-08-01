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
      uploads: uploads.map(({ file, transaction }) => {
        const payload = {
          name: file.name,
          mutationId: transaction.getID(),
        }
        if (file.payload && file.payload.file && file.payload.file.id) {
          payload.fileId = file.payload.file.id
        }
        return payload
      }),
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
