import { GraphQLNonNull, GraphQLString } from 'graphql'
import { offsetToCursor, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'
import config from '../../config/environment'

import GraphQLBot from '../types/GraphQLBot'
import Answers from '../connections/Answers'

const debug = require('debug')('server:graphql:mutations:GraphQLCreateAnswerMutation')

export default mutationWithClientMutationId({
  name: 'CreateAnswer',
  inputFields: {
    title: {
      description: 'Title of the Answer',
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      description: 'Body of the Answer',
      type: new GraphQLNonNull(GraphQLString),
    },
    botId: {
      description: 'ID of the Bot for this Answer',
      type: new GraphQLNonNull(GraphQLString),
    },
    topicId: {
      description: 'ID of the default Topic to copy this Answer to',
      type: GraphQLString,
    },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: ({ teamId, botId }) => db.bot.getBot(teamId, botId),
    },
    answerEdge: {
      type: Answers.edgeType,
      resolve: async ({ answer, botId }) => {
        // XXX need to have a way to do this that doesn't require fetching
        // all answers
        const answers = await db.answer.getAnswers(botId)

        // TODO: maybe we make this our own function?
        // cursorForObjectInConnection indexOf was returning -1 even though the
        // item was there, something to do with ===
        let cursor
        for (const index in answers) {
          const a = answers[index]
          if (a.id === answer.id) {
            cursor = offsetToCursor(index)
            break
          }
        }

        return { cursor, node: answer }
      }
    },
  },
  mutateAndGetPayload: async ({ title, body, botId: globalBotId, topicId: globalTopicId }, { auth }) => {
    const { uid: createdBy } = auth
    const { id: compositeId } = fromGlobalId(globalBotId)
    const [teamId, botId] = db.client.deconstructId(compositeId)
    const answer = await db.answer.createAnswer({
      title,
      body,
      botId,
      teamId,
      createdBy,
    })
    if (config.features.replies && globalTopicId) {
      const { id: topicCompositeId } = fromGlobalId(globalTopicId)
      const [teamId, topicId] = db.client.deconstructId(topicCompositeId)
      debug('Copying answer to reply', { topicId })
      let reply
      try {
        reply = await db.reply.createReply({
          id: answer.id,
          title,
          body,
          teamId,
          createdBy,
          topicId,
        })
      } catch (err) {
        logger.error('Error copying answer to reply', { err, answer, topicId })
      }
      debug('Copied answer to reply', { reply })
    } else if (!globalTopicId) {
      logger.warn('Can\'t copy reply', {
        userId: auth.uid,
        teamId: auth.tid,
        answerId: answer.id,
      })
    }

    tracker.trackCreateAnswer({ auth, id: answer.id })
    return { answer, teamId, botId }
  },
})
