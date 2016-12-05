import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import logger from '../../logger'
import tracker from '../../tracker'
import GraphQLTopic from '../types/GraphQLTopic'

export default mutationWithClientMutationId({
  name: 'UpdateTopic',
  inputFields: {
    id: {
      description: 'ID of the Topic to update',
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      description: 'Updated name of the Topic',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    topic: {
      type: GraphQLTopic,
      resolve: topic => topic,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, name, pointsOfContact }, { auth }) => {
    const { uid: updatedBy, tid: teamId } = auth
    const { id: compositeId } = fromGlobalId(globalId)
    const id = db.client.deconstructId(compositeId)[1]
    const params = {
      id,
      updatedBy,
      teamId,
      name,
      pointsOfContact: [],
    }
    let topic
    try {
      topic = await db.topic.updateTopic(params)
    } catch (err) {
      logger.error('Error updating topic', { params, err, auth })
      throw err
    }
    tracker.trackUpdateTopic({ id, auth })
    return topic
  },
})
