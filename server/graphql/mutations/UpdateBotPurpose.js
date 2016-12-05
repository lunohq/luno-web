import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import logger from '../../logger'
import tracker from '../../tracker'
import GraphQLBot from '../types/GraphQLBot'

export default mutationWithClientMutationId({
  name: 'UpdateBotPurpose',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    // TODO this should be required once we properly default when the user is created
    purpose: { type: GraphQLString },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: bot => bot,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, purpose }, { auth }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [teamId, id] = db.client.deconstructId(compositeId)

    let bot
    try {
      bot = await db.bot.updatePurpose({
        teamId,
        id,
        purpose: purpose || null,
      })
    } catch (err) {
      logger.error('Error updating bot purpose', { err, auth })
      throw err
    }
    tracker.trackUpdateBotPurpose({ auth, id })
    return bot
  },
})
