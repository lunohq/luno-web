import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import logger from '../../logger'
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
      resolve: async ({ teamId, topicId }, args, { auth }) => {
        let topic
        try {
          topic = db.topic.getTopic({ teamId, id: topicId })
        } catch (err) {
          logger.error('Error fetching topic', { err, auth, topicId })
          throw err
        }
        return topic
      },
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
    let reply
    try {
      reply = await db.reply.deleteReply({ teamId, id })
    } catch (err) {
      logger.error('Error deleting reply', { id, auth, err })
      throw err
    }

    if (reply.attachments && reply.attachments.length) {
      const fileIds = reply.attachments.map(attachment => attachment.file.id)
      try {
        await deleteFiles({ teamId, fileIds })
      } catch (err) {
        logger.error('Error deleting files', { fileIds, auth })
        throw err
      }
    }
    tracker.trackDeleteAnswer({ id, auth })
    return {
      globalId,
      teamId,
      topicId,
    }
  },
})
