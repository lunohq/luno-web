import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import { deleteFiles } from '../../actions/file'
import tracker from '../../tracker'

import GraphQLTopic from '../types/GraphQLTopic'

export default mutationWithClientMutationId({
  name: 'DeleteReply',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    topicId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    topic: {
      type: GraphQLTopic,
      // XXX why do we need to refetch topic here? seems like there should be a
      // better way to break that cache
      resolve: ({ teamId, topicId }) => db.topic.getTopic({ teamId, id: topicId })
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ globalId }) => globalId,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, topicId: globalTopicId }, { auth }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const { id: compositeTopicId } = fromGlobalId(globalTopicId)
    const { tid: teamId } = auth
    const id = db.client.deconstructId(compositeId)[1]
    const topicId = db.client.deconstructId(compositeTopicId)[1]
    const reply = await db.reply.deleteReply({ teamId, id })
    if (reply.attachments && reply.attachments.length) {
      const fileIds = reply.attachments.map(attachment => attachment.file.id)
      await deleteFiles({ teamId, fileIds })
    }
    tracker.trackDeleteAnswer({ id, auth })
    return {
      globalId,
      teamId,
      topicId,
    }
  },
})
