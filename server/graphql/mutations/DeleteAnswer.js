import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'
import config from '../../config/environment'

import GraphQLBot from '../types/GraphQLBot'

const debug = require('debug')('server:graphql:mutations:GraphQLDeleteAnswerMutation')

export default mutationWithClientMutationId({
  name: 'DeleteAnswer',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: ({ teamId, botId }) => db.bot.getBot(teamId, botId),
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ globalId }) => globalId,
    },
  },
  mutateAndGetPayload: async ({ id: globalId }, { auth }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [botId, id] = db.client.deconstructId(compositeId)
    const { teamId } = await db.answer.deleteAnswer(botId, id)
    if (config.features.replies) {
      debug('Deleting reply', { teamId, id })
      let reply
      try {
        reply = await db.reply.deleteReply({ teamId, id })
      } catch (err) {
        logger.error('Error deleting reply', { err, teamId, id })
      }
      debug('Deleted reply', { reply })
    }
    tracker.trackDeleteAnswer({ id, auth })
    return {
      botId,
      globalId,
      teamId,
    }
  },
})
