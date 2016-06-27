import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'

import GraphQLReply from '../types/GraphQLReply'

export default mutationWithClientMutationId({
  name: 'UpdateReply',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    topicId: { type: GraphQLString },
  },
  outputFields: {
    reply: {
      type: GraphQLReply,
      resolve: reply => reply,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, title, body, topicId: globalTopicId, botId: globalBotId }, { auth }) => {
    const { uid: updatedBy } = auth
    const { id: compositeId } = fromGlobalId(globalId)
    const { id: compositeTopicId } = fromGlobalId(globalTopicId)
    const [teamId, id] = db.client.deconstructId(compositeId)
    const topicId = db.client.deconstructId(compositeTopicId)[1]
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
    return reply
  },
})
