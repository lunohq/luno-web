import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'

import GraphQLTopic from '../types/GraphQLTopic'

export default mutationWithClientMutationId({
  name: 'DeleteReply',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    topicId: { type: new GraphQLNonNull(GraphQLID) },
    botId: { type: new GraphQLNonNull(GraphQLID) },
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
  mutateAndGetPayload: async ({ id: globalId, botId: globalBotId, topicId: globalTopicId }, { auth }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const { id: compositeTopicId } = fromGlobalId(globalTopicId)
    const [teamId, id] = db.client.deconstructId(compositeId)
    const topicId = db.client.deconstructId(compositeTopicId)[1]
    await db.reply.deleteReply({ teamId, id })
    // Delete the corresponding answer as well
    try {
      const { id: compositeBotId } = fromGlobalId(globalBotId)
      const botId = db.client.deconstructId(compositeBotId)[1]
      await db.answer.deleteAnswer(botId, id)
    } catch (err) {
      logger.error('Error deleting answer', { err, teamId, id, globalBotId })
    }
    tracker.trackDeleteAnswer({ id, auth })
    return {
      globalId,
      teamId,
      topicId,
    }
  },
})
