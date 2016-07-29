import Relay from 'react-relay'

export default class UploadFile extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { uploadFile }`
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on UploadFilePayload {
            file {
              id
              name
              permalink
              key
              bucket
              created
            }
          }
        `,
      ],
    }]
  }

  getVariables() {}

  getFatQuery() {
    return Relay.QL`
      fragment on UploadFilePayload {
        file
      }
    `
  }

  getFiles() {
    return {
      file: this.props.file,
    }
  }

}
