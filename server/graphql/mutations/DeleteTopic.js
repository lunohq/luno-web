import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

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
      resolve: (payload, { auth }) => db.user.getUser(auth.uid),
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
    await db.topic.deleteTopic({ teamId, id })
    tracker.trackDeleteTopic({ id, auth })
    return { globalId }
  },
})
