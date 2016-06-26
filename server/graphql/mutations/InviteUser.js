import { GraphQLNonNull, GraphQLString } from 'graphql'
import { offsetToCursor, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'
import { sendInvite } from '../../actions/notifications'

import GraphQLTeam from '../types/GraphQLTeam'
import GraphQLUser from '../types/GraphQLUser'
import GraphQLUserRole from '../types/GraphQLUserRole'
import Users from '../connections/Users'

const debug = require('debug')('server:graphql:mutations:InviteUser')

export default mutationWithClientMutationId({
  name: 'InviteUser',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(GraphQLUserRole) },
    username: { type: new GraphQLNonNull(GraphQLString) },
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
    userEdge: {
      type: Users.edgeType,
      resolve: async (user) => {
        // TODO need to do this without fetching all users
        const users = await db.user.getUsers(user.teamId)
        let cursor
        for (const index in users) {
          const u = users[index]
          if (user.id === u.id) {
            cursor = offsetToCursor(index)
            break
          }
        }

        return { cursor, node: user }
      },
    },
  },
  mutateAndGetPayload: async ({ userId: globalId, role, username }, { auth }) => {
    const { id: userId } = fromGlobalId(globalId)
    const { tid: teamId, uid: invitedBy } = auth
    const params = {
      role,
      teamId,
      user: username,
      id: userId,
      invite: {
        invitedBy,
        created: new Date().toISOString(),
      },
    }
    debug('Inviting user', { params })
    const [team, user] = await Promise.all([
      await db.team.getTeam(teamId),
      await db.user.updateUser(params),
    ])

    try {
      await sendInvite({ team, sourceUserId: invitedBy, userId })
    } catch (err) {
      logger.error('Error sending invite notification', { err, team, invitedBy, userId })
    }

    tracker.trackInviteUser({
      auth,
      teamId,
      userId,
      role: GraphQLUserRole.serialize(role),
    })
    return user
  },
})
