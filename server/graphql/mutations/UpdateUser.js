import { GraphQLID, GraphQLNonNull } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'
import { sendAdminPromotion } from '../../actions/notifications'
import GraphQLTeam from '../types/GraphQLTeam'
import GraphQLUser from '../types/GraphQLUser'
import GraphQLUserRole from '../types/GraphQLUserRole'

const debug = require('debug')('server:graphql:mutations:UpdateUser')

export default mutationWithClientMutationId({
  name: 'UpdateUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    role: { type: new GraphQLNonNull(GraphQLUserRole) },
  },
  outputFields: {
    team: {
      type: GraphQLTeam,
      resolve: ({ teamId }) => db.team.getTeam(teamId),
    },
    user: {
      type: GraphQLUser,
      resolve: (user) => user,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, role }, { auth }) => {
    const { id } = fromGlobalId(globalId)
    const { tid: teamId, uid: sourceUserId } = auth
    const params = {
      id,
      role,
      teamId,
    }
    debug('Updating user', { params })
    const [previous, user, team] = await Promise.all([
      db.user.getUser(id),
      db.user.updateUser(params),
      db.team.getTeam(teamId),
    ])

    const shouldNotify = !previous.isAdmin && user.isAdmin
    debug('Should send admin promotion notification', { shouldNotify, previous, user })
    if (shouldNotify) {
      debug('Sending admin promotion notification', { user })
      try {
        await sendAdminPromotion({ team, sourceUserId, userId: id })
      } catch (err) {
        logger.error('Error sending promotion notification', { err, team, sourceUserId, userId: id })
      }
    }
    tracker.trackUpdateUser({ auth, id })
    return user
  },
})
