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
      resolve: async ({ teamId }, args, { auth }) => {
        let team
        try {
          team = await db.team.getTeam(teamId)
        } catch (err) {
          logger.error('Error fetching team', { err, auth })
          throw err
        }
        return team
      },
    },
    user: {
      type: GraphQLUser,
      resolve: (user) => user,
    },
    userEdge: {
      type: Users.edgeType,
      resolve: async (user, args, { auth }) => {
        // TODO need to do this without fetching all users
        let users
        try {
          users = await db.user.getUsers(user.teamId)
        } catch (err) {
          logger.error('Error fetching users', { user, err, auth })
          throw err
        }
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

    let results
    try {
      results = await Promise.all([
        await db.team.getTeam(teamId),
        await db.user.updateUser(params),
      ])
    } catch (err) {
      logger.error('Error updating user', { params, auth, err })
      throw err
    }

    const [team, user] = results

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
