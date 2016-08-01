import { mutationWithClientMutationId } from 'graphql-relay'

import { wasCancelled, deleteFile, createFile } from '../../actions/file'
import GraphQLFile from '../types/GraphQLFile'

import d from '../../utils/debug'
const debug = d(__filename)

export default mutationWithClientMutationId({
  name: 'UploadFile',
  outputFields: {
    file: { type: GraphQLFile },
  },
  mutateAndGetPayload: async ({ clientMutationId: mutationId }, { request: { file: upload }, auth }) => {
    const { uid: userId, tid: teamId } = auth
    const name = upload.lambda.name
    debug('Uploaded file', { upload, mutationId })
    const cancelled = await wasCancelled({
      mutationId,
      teamId,
      userId,
      name,
    })
    let file
    if (cancelled) {
      debug('Cancelled file')
      await deleteFile({
        file: {
          name,
          bucket: upload.s3.bucket,
          key: upload.s3.key,
          id: upload.lambda.id,
        },
        teamId,
      })
    } else {
      file = await createFile({ userId, teamId, upload, mutationId })
    }

    if (file) {
      return { file }
    }
    return {}
  },
})
