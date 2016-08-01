import Relay from 'react-relay'

export default class DeleteFile extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { deleteFile }`
  }

  getConfigs() {
    return []
  }

  getVariables() {
    const { file } = this.props
    return { fileId: file.id }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteFilePayload {
        fileId
      }
    `
  }

}
