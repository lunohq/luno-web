import { mutationWithClientMutationId } from 'graphql-relay'

import logger from '../../logger'
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
    let cancelled
    try {
      cancelled = await wasCancelled({
        mutationId,
        teamId,
        userId,
        name,
      })
    } catch (err) {
      logger.error('Error checking if file cancelled', { err, auth })
      throw err
    }
    let file
    if (cancelled) {
      debug('Cancelled file')
      try {
        await deleteFile({
          file: {
            name,
            bucket: upload.s3.bucket,
            key: upload.s3.key,
            id: upload.lambda.id,
          },
          teamId,
        })
      } catch (err) {
        logger.error('Error deleting file', { err, auth })
        throw err
      }
    } else {
      try {
        file = await createFile({ userId, teamId, upload, mutationId })
      } catch (err) {
        logger.error('Error creating file', { auth, err })
        throw err
      }
    }

    if (file) {
      return { file }
    }
    return {}
  },
})
