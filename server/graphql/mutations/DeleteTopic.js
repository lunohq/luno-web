import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import logger from '../../logger'
import tracker from '../../tracker'
import GraphQLUser from '../types/GraphQLUser'

export default mutationWithClientMutationId({
  name: 'DeleteTopic',
  inputFields: {
    id: {
      description: 'The ID of the Topic to delete',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: async (payload, args, { auth }) => {
        let user
        try {
          user = await db.user.getUser(auth.uid)
        } catch (err) {
          logger.error('Error fetching user', { auth, err })
          throw err
        }
        return user
      },
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ globalId }) => globalId,
    },
  },
  mutateAndGetPayload: async ({ id: globalId }, { auth }) => {
    const { tid: teamId } = auth
    const { id: compositeId } = fromGlobalId(globalId)
    const id = db.client.deconstructId(compositeId)[1]
    try {
      await db.topic.deleteTopic({ teamId, id })
    } catch (err) {
      logger.error('Error deleting topic', { id, auth, err })
      throw err
    }
    tracker.trackDeleteTopic({ id, auth })
    return { globalId, auth }
  },
})
