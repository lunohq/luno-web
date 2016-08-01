import { GraphQLList, GraphQLString } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'

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
  mutateAndGetPayload: async ({ uploads }, { auth: { tid: teamId, uid: userId } }) => {
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
      const response = await cancelFileUploads({ teamId, userId, uploads: filesToCancel })
      for (const index in response) {
        const res = response[index]
        if (!res) {
          const { mutationId, name } = uploads[index]
          debug('Should delete cancelled file', { mutationId, name })
          const data = await wasCancelled({ name, mutationId, teamId, userId })
          const file = JSON.parse(data)
          debug('Deleting cancelled file', { file })
          filesToDelete.push(file)
        }
      }
    }

    debug('Files to delete', { filesToDelete })
    if (filesToDelete.length) {
      debug('Deleting cancelled files', { filesToDelete })
      await deleteFiles({ files: filesToDelete, teamId })
    }

    if (fileIdsToDelete.length) {
      debug('Deleting cancelled fileIds', { fileIdsToDelete })
      await deleteFiles({ fileIds: fileIdsToDelete, teamId })
    }

    debug('Cancelled upload', { uploads, teamId, userId })
    return {
      mutationIds: uploads.map(({ mutationId }) => mutationId),
    }
  },
})
