import { GraphQLString } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'

import { deleteFiles } from '../../actions/file'

export default mutationWithClientMutationId({
  name: 'DeleteFile',
  inputFields: {
    fileId: { type: GraphQLString },
  },
  outputFields: {
    fileId: { type: GraphQLString },
  },
  mutateAndGetPayload: async ({ fileId }, { auth: { tid: teamId } }) => {
    const { id } = fromGlobalId(fileId)
    await deleteFiles({ fileIds: [id], teamId })
    return { fileId }
  },
})
