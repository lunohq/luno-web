import { mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import GraphQLFile from '../types/GraphQLFile'

import d from '../../utils/debug'
const debug = d(__filename)

export default mutationWithClientMutationId({
  name: 'UploadFile',
  outputFields: {
    file: { type: GraphQLFile },
  },
  mutateAndGetPayload: async (args, { request: { file: upload }, auth }) => {
    const { uid: createdBy, tid: teamId } = auth
    debug('Uploaded file', { upload, args })
    const file = await db.file.createFile({
      createdBy,
      teamId,
      id: upload.lambda.id,
      name: upload.lambda.name,
      permalink: upload.lambda.permalink,
      key: upload.s3.key,
      bucket: upload.s3.bucket,
      created: upload.lambda.created,
    })
    return { file }
  },
})
