import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

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
    const topic = await db.topic.updateTopic({
      id,
      updatedBy,
      teamId,
      name,
      pointsOfContact: [],
    })
    tracker.trackUpdateTopic({ id, auth })
    return topic
  },
})
