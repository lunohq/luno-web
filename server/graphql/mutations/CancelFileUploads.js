import { GraphQLList, GraphQLString } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'

import logger from '../../logger'
import { cancelFileUploads, deleteFiles, wasCancelled } from '../../actions/file'

import GraphQLCancelFileInput from '../types/GraphQLCancelFileInput'

import d from '../../utils/debug'
const debug = d(__filename)

export default mutationWithClientMutationId({
  name: 'CancelFileUploads',
  inputFields: {
    uploads: {
      type: new GraphQLList(GraphQLCancelFileInput),
      description: 'An array of uploads to cancel',
    },
  },
  outputFields: {
    mutationIds: {
      type: new GraphQLList(GraphQLString),
      description: 'List of the mutationIds that were cancelled',
    },
  },
  mutateAndGetPayload: async ({ uploads }, { auth }) => {
    const { tid: teamId, uid: userId } = auth
    const fileIdsToDelete = []
    const filesToDelete = []
    const filesToCancel = []
    uploads.forEach(({ fileId, ...rest }) => {
      if (fileId) {
        const { id } = fromGlobalId(fileId)
        fileIdsToDelete.push(id)
      } else {
        filesToCancel.push(rest)
      }
    })

    if (filesToCancel.length) {
      let response
      try {
        response = await cancelFileUploads({ teamId, userId, uploads: filesToCancel })
      } catch (err) {
        logger.error('Error cancelling file uploads', { err, auth })
        throw err
      }
      for (const index in response) {
        const res = response[index]
        if (!res) {
          const { mutationId, name } = uploads[index]
          debug('Should delete cancelled file', { mutationId, name })
          let data
          try {
            data = await wasCancelled({ name, mutationId, teamId, userId })
          } catch (err) {
            logger.error('Error checking if file was cancelled', { err, auth })
            throw err
          }
          const file = JSON.parse(data)
          debug('Deleting cancelled file', { file })
          filesToDelete.push(file)
        }
      }
    }

    debug('Files to delete', { filesToDelete })
    if (filesToDelete.length) {
      debug('Deleting cancelled files', { filesToDelete })
      try {
        await deleteFiles({ files: filesToDelete, teamId })
      } catch (err) {
        logger.error('Error deleting files', { err, auth })
        throw err
      }
    }

    if (fileIdsToDelete.length) {
      debug('Deleting cancelled fileIds', { fileIdsToDelete })
      try {
        await deleteFiles({ fileIds: fileIdsToDelete, teamId })
      } catch (err) {
        logger.error('Error deleting fileIds', { err, auth })
        throw err
      }
    }

    debug('Cancelled upload', { uploads, teamId, userId })
    return {
      mutationIds: uploads.map(({ mutationId }) => mutationId),
    }
  },
})
