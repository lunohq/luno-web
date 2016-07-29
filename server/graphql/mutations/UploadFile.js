import { mutationWithClientMutationId } from 'graphql-relay'

import GraphQLFile from '../types/GraphQLFile'

import d from '../../utils/debug'
const debug = d(__filename)

export default mutationWithClientMutationId({
  name: 'UploadFile',
  outputFields: {
    file: { type: GraphQLFile },
  },
  mutateAndGetPayload: async (args, { request: { file } }) => {
    debug('Uploaded file', { file })
    return { file }
  },
})
