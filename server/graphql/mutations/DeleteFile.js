import { GraphQLString } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'

import logger from '../../logger'
import { deleteFiles } from '../../actions/file'

export default mutationWithClientMutationId({
  name: 'DeleteFile',
  inputFields: {
    fileId: { type: GraphQLString },
  },
  outputFields: {
    fileId: { type: GraphQLString },
  },
  mutateAndGetPayload: async ({ fileId }, { auth }) => {
    const { tid: teamId } = auth
    const { id } = fromGlobalId(fileId)
    try {
      await deleteFiles({ fileIds: [id], teamId })
    } catch (err) {
      logger.error('Error deleting file', { auth, err, fileId })
      throw err
    }
    return { fileId }
  },
})
