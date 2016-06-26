import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'
import config from '../../config/environment'

import GraphQLAnswer from '../types/GraphQLAnswer'

const debug = require('debug')('server:graphql:mutations:GraphQLUpdateAnswerMutation')

export default mutationWithClientMutationId({
  name: 'UpdateAnswer',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    topicId: { type: GraphQLString },
  },
  outputFields: {
    answer: {
      type: GraphQLAnswer,
      resolve: answer => answer,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, title, body, topicId: globalTopicId }, { auth }) => {
    const { uid: updatedBy } = auth
    const { id: compositeId } = fromGlobalId(globalId)
    const [botId, id] = db.client.deconstructId(compositeId)
    const answer = await db.answer.updateAnswer({
      body,
      title,
      botId,
      id,
      updatedBy,
    })
    if (config.features.replies && globalTopicId) {
      const { id: compositeTopicId } = fromGlobalId(globalTopicId)
      const [teamId, topicId] = db.client.deconstructId(compositeTopicId)
      debug('Updating reply', { teamId, id, topicId })
      let reply
      try {
        reply = await db.reply.updateReply({ teamId, id, body, title, updatedBy, topicId })
      } catch (err) {
        logger.error('Error updating reply', { err, answer })
      }
      debug('Updated reply', { reply })
    } else if (!globalTopicId) {
      logger.warn('Can\'t update reply', {
        userId: auth.uid,
        teamId: auth.tid,
        answerId: answer.id,
      })
    }

    tracker.trackUpdateAnswer({ auth, id })
    return answer
  },
})
