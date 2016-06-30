import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { toGlobalId, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'

import GraphQLReply from '../types/GraphQLReply'
import GraphQLTopic from '../types/GraphQLTopic'
import Replies from '../connections/Replies'
import { cursorForInstanceInCollection } from '../utils'

export default mutationWithClientMutationId({
  name: 'UpdateReply',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    topicId: { type: new GraphQLNonNull(GraphQLID) },
    previousTopicId: { type: new GraphQLNonNull(GraphQLID) },
    botId: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    reply: {
      type: GraphQLReply,
      resolve: ({ reply }) => reply,
    },
    replyId: {
      type: GraphQLID,
      resolve: ({ reply }) => toGlobalId('Reply', reply.id),
    },
    replyEdge: {
      type: Replies.edgeType,
      resolve: async ({ reply, topicId, teamId }) => {
        const replies = await db.reply.getRepliesForTopic({ teamId, topicId })
        return cursorForInstanceInCollection(reply, replies)
      },
    },
    previousTopic: {
      type: GraphQLTopic,
      resolve: ({ previousTopicId, teamId }) => db.topic.getTopic({ teamId, id: previousTopicId }),
    },
    topic: {
      type: GraphQLTopic,
      resolve: ({ topicId, teamId }) => db.topic.getTopic({ teamId, id: topicId }),
    },
  },
  mutateAndGetPayload: async ({
    id: globalId,
    title,
    body,
    topicId: globalTopicId,
    previousTopicId: globalPreviousTopicId,
    botId: globalBotId,
  }, { auth }) => {
    const { uid: updatedBy } = auth
    const { id: compositeId } = fromGlobalId(globalId)
    const { id: compositeTopicId } = fromGlobalId(globalTopicId)
    const { id: compositePreviousTopicId } = fromGlobalId(globalPreviousTopicId)
    const [teamId, id] = db.client.deconstructId(compositeId)
    const topicId = db.client.deconstructId(compositeTopicId)[1]
    const previousTopicId = db.client.deconstructId(compositePreviousTopicId)[1]
    const reply = await db.reply.updateReply({
      id,
      body,
      title,
      updatedBy,
      topicId,
      teamId,
    })
    // Update the corresponding answer
    try {
      const { id: compositeBotId } = fromGlobalId(globalBotId)
      const botId = db.client.deconstructId(compositeBotId)[1]
      await db.answer.updateAnswer({
        body,
        title,
        botId,
        id,
        updatedBy,
      })
    } catch (err) {
      logger.error('Error updating answer', { teamId, id, globalBotId, reply })
    }
    tracker.trackUpdateAnswer({ auth, id })
    return { reply, teamId, topicId, previousTopicId }
  },
})
