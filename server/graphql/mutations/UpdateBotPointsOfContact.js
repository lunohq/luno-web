import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import GraphQLBot from '../types/GraphQLBot'

const debug = require('debug')('server:graphql:mutations:UpdateBotPointsOfContact')

export default mutationWithClientMutationId({
  name: 'UpdateBotPointsOfContact',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Bot ID',
    },
    pointsOfContact: {
      type: new GraphQLList(GraphQLString),
      description: 'Points of contact for the bot. Should be a list of Slack user ids',
    },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: bot => bot,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, pointsOfContact: globalIds }, { auth }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [teamId, id] = db.client.deconstructId(compositeId)
    debug('Points of contact', { globalIds })
    const pointsOfContact = globalIds.map((id) => fromGlobalId(id).id)

    const bot = await db.bot.updatePointsOfContact({
      pointsOfContact,
      teamId,
      id,
    })
    tracker.trackUpdateBotPointsOfContact({ auth, id })
    return bot
  },
})
