import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'

import GraphQLTopic from '../types/GraphQLTopic'
import Replies from '../connections/Replies'
import { cursorForInstanceInCollection } from '../utils'

export default mutationWithClientMutationId({
  name: 'CreateReply',
  inputFields: {
    title: {
      description: 'Title of the Reply',
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      description: 'Body of the Reply',
      type: new GraphQLNonNull(GraphQLString),
    },
    keywords: {
      description: 'Comma delimited list of keywords to store with the Reply',
      type: GraphQLString,
    },
    topicId: {
      description: 'ID of the Topic the Reply is assigned to.',
      type: new GraphQLNonNull(GraphQLID),
    },
    botId: {
      description: 'ID of the Bot to support copying to answer.',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    topic: {
      type: GraphQLTopic,
      resolve: ({ teamId, topicId: id }) => db.topic.getTopic({ teamId, id }),
    },
    replyEdge: {
      type: Replies.edgeType,
      resolve: async ({ reply, topicId, teamId }) => {
        const replies = await db.reply.getRepliesForTopic({ teamId, topicId })
        return cursorForInstanceInCollection(reply, replies)
      }
    },
  },
  mutateAndGetPayload: async ({ title, body, keywords, topicId: globalId, botId: globalBotId }, { auth }) => {
    const { uid: createdBy } = auth
    const { id: compositeId } = fromGlobalId(globalId)
    const [teamId, topicId] = db.client.deconstructId(compositeId)
    const reply = await db.reply.createReply({
      title,
      body,
      keywords,
      teamId,
      createdBy,
      topicId,
    })
    // Create the corresponding answer
    try {
      const { id: compositeBotId } = fromGlobalId(globalBotId)
      const botId = db.client.deconstructId(compositeBotId)[1]
      await db.answer.createAnswer({
        title,
        body,
        botId,
        teamId,
        createdBy,
        id: reply.id,
      })
    } catch (err) {
      logger.error('Error creating answer', { err, globalBotId, reply })
    }
    tracker.trackCreateAnswer({ auth, id: reply.id })
    return { reply, teamId, topicId }
  },
})
