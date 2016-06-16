/* eslint-disable no-unused-vars, no-use-before-define */
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  offsetToCursor,
  fromGlobalId,
  globalIdField,
  toGlobalId,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay'

import { db } from 'luno-core'
import tracker from '../tracker'
import logger from '../logger'

import { getMember, getMembers, SlackMember } from '../actions/slack'
import { sendInvite, sendAdminPromotion } from '../actions/notifications'

const debug = require('debug')('server:data:schema')

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'Team') {
      return db.team.getTeam(id)
    } else if (type === 'User') {
      return db.user.getUser(id)
    } else if (type === 'Bot') {
      const [partitionKey, sortKey] = db.client.deconstructId(id)
      return db.bot.getBot(partitionKey, sortKey)
    } else if (type === 'Answer') {
      const [partitionKey, sortKey] = db.client.deconstructId(id)
      return db.answer.getAnswer(partitionKey, sortKey)
    } else if (type === 'SlackMember') {
      const [teamId, id] = db.client.deconstructId(id)
      return getMember(teamId, id)
    }
    return null
  },
  (obj) => {
    if (obj instanceof db.team.Team) {
      return GraphQLTeam
    } else if (obj instanceof db.user.User) {
      return GraphQLUser
    } else if (obj instanceof db.bot.Bot) {
      return GraphQLBot
    } else if (obj instanceof db.answer.Answer) {
      return GraphQLAnswer
    } else if (obj instanceof SlackMember) {
      return GraphQLSlackMember
    }
    return null
  },
)

function adminMutation({ resolve, ...other }) {
  return {
    resolve: async (source, args, context, info) => {
      // TODO this should be cached
      const user = await db.user.getUser(source.uid)
      if (!user.isAdmin) {
        throw new Error('Permission Denied')
      }
      return resolve(source, args, context, info)
    },
    ...other,
  }
}

function staffMutation({ resolve, ...other }) {
  return {
    resolve: async (source, args, context, info) => {
      // TODO this should be cached
      const user = await db.user.getUser(source.uid)
      if (!user.isStaff) {
        throw new Error('Permission Denied')
      }
      return resolve(source, args, context, info)
    },
    ...other,
  }
}

// Our GraphQL Types

const GraphQLSlackBot = new GraphQLObjectType({
  name: 'SlackBot',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Our main slack bot id for the Team',
    },
  },
})

const GraphQLSlackInfo = new GraphQLObjectType({
  name: 'SlackInfo',
  description: 'Slack info related to a Team',
  fields: {
    bot: { type: GraphQLSlackBot },
  },
})

const GraphQLSlackMemberProfile = new GraphQLObjectType({
  name: 'SlackMemberProfile',
  description: 'Slack member profile object',
  fields: {
    realName: {
      type: GraphQLString,
      description: 'Slack user\'s full name',
      resolve: obj => obj.real_name,
    },
    email: {
      type: GraphQLString,
      description: 'Slack user email',
    },
  },
})

const GraphQLTeam = new GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: globalIdField('Team'),
    name: {
      type: GraphQLString,
      description: 'Team domain (maps to slack domain)',
    },
    slack: {
      type: GraphQLSlackInfo,
      description: 'Slack info related to the Team',
    },
    createdBy: globalIdField('User', obj => obj.createdBy),
    members: {
      type: SlackMembersConnection,
      description: 'Members of the slack team',
      args: connectionArgs,
      resolve: async (team, args) => {
        const members = await getMembers(team.id)
        return connectionFromArray(members, args)
      },
    },
    users: {
      type: UsersConnection,
      description: 'Users within Luno',
      args: connectionArgs,
      resolve: async (team, args) => {
        const users = await db.user.getUsers(team.id)
        return connectionFromArray(users, args)
      },
    },
    staff: {
      type: UsersConnection,
      description: 'Admin or Trainers with Luno',
      args: connectionArgs,
      resolve: async (team, args) => {
        const users = await db.user.getStaff(team.id)
        return connectionFromArray(users, args)
      },
    },
    admins: {
      type: UsersConnection,
      description: 'Admins within Luno',
      args: connectionArgs,
      resolve: async (team, args) => {
        const admins = await db.user.getAdmins(team.id)
        return connectionFromArray(admins, args)
      },
    },
  }),
  interfaces: [nodeInterface],
})

const GraphQLSlackMember = new GraphQLObjectType({
  name: 'SlackMember',
  fields: () => ({
    id: globalIdField('SlackMember', obj => db.client.compositeId(obj.teamId, obj.id)),
    userId: globalIdField('User', obj => obj.id),
    name: {
      type: GraphQLString,
      description: 'Member\'s slack username',
    },
    profile: {
      type: GraphQLSlackMemberProfile,
      description: 'Member\'s slack profile',
    },
  }),
  interfaces: [nodeInterface],
})

const GraphQLUserRole = new GraphQLEnumType({
  name: 'UserRole',
  values: {
    ADMIN: { value: db.user.ADMIN },
    TRAINER: { value: db.user.TRAINER },
    CONSUMER: { value: db.user.CONSUMER },
  },
})

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  description: 'User within our system',
  fields: () => ({
    id: globalIdField('User'),
    username: {
      type: GraphQLString,
      description: 'The username of the User',
      resolve: user => user.user,
    },
    team: {
      type: GraphQLTeam,
      description: 'The Team the User belongs to',
      resolve: user => {
        if (!user.anonymous) {
          return db.team.getTeam(user.teamId)
        }
        return null
      },
    },
    bots: {
      type: BotsConnection,
      description: 'Bots the User has access to',
      args: connectionArgs,
      resolve: async (user, args) => {
        if (!user.anonymous) {
          const bots = await db.bot.getBots(user.teamId)
          return connectionFromArray(bots, args)
        }
        return null
      },
    },
    anonymous: {
      type: GraphQLBoolean,
      description: 'Boolean indicating whether or not the user is authenticated',
    },
    assumed: {
      type: GraphQLBoolean,
      description: 'Boolean indicating whether or not an admin is assuming this user',
    },
    role: {
      type: GraphQLUserRole,
      description: 'Role of the user',
      resolve: user => user.role === undefined ? db.user.CONSUMER : user.role,
    },
    isStaff: {
      type: GraphQLBoolean,
      description: 'Boolean for whether or not the user is a staff member',
      resolve: user => user.isStaff,
    },
    isAdmin: {
      type: GraphQLBoolean,
      description: 'Boolean for whether or not the user is an admin',
      resolve: user => user.isAdmin,
    },
    displayRole: {
      type: GraphQLString,
      description: 'The display name for the user\'s role',
      resolve: (user) => {
        switch (user.role) {
          case undefined:
          case db.user.ADMIN:
            return 'Superadmin'
          case db.user.TRAINER:
            return 'Trainer'
          default:
            return ''
        }
      },
    },
  }),
  interfaces: [nodeInterface],
})

const GraphQLBot = new GraphQLObjectType({
  name: 'Bot',
  description: 'Bot within our system',
  fields: () => ({
    id: globalIdField('Bot', obj => db.client.compositeId(obj.teamId, obj.id)),
    purpose: {
      type: GraphQLString,
      description: 'Purpose of the Bot',
    },
    pointsOfContact: {
      type: new GraphQLList(GraphQLID),
      description: 'Points of contact of the Bot for escalation',
      resolve: (obj) => obj.pointsOfContact ? obj.pointsOfContact.map(id => toGlobalId('User', id)) : null,
    },
    answers: {
      type: AnswersConnection,
      description: 'Answers configured for the Bot',
      args: connectionArgs,
      resolve: async (bot, args) => {
        const answers = await db.answer.getAnswers(bot.id)
        return connectionFromArray(answers, args)
      },
    },
  }),
  interfaces: [nodeInterface],
})

const GraphQLAnswer = new GraphQLObjectType({
  name: 'Answer',
  description: 'An answer that is tied to a Bot',
  fields: () => ({
    id: globalIdField('Answer', obj => db.client.compositeId(obj.botId, obj.id)),
    title: {
      type: GraphQLString,
      description: 'Title of the Answer',
    },
    body: {
      type: GraphQLString,
      description: 'Body of the Answer',
    },
    changed: {
      type: GraphQLString,
      description: 'Date the Answer was changed',
    },
  }),
  interfaces: [nodeInterface],
})

// Our Relay GraphQL Connection Types

const { connectionType: UsersConnection, edgeType: GraphQLUserEdge } = connectionDefinitions({
  name: 'User',
  nodeType: GraphQLUser,
})

const { connectionType: BotsConnection } = connectionDefinitions({
  name: 'Bot',
  nodeType: GraphQLBot,
})

const { connectionType: AnswersConnection, edgeType: GraphQLAnswerEdge } = connectionDefinitions({
  name: 'Answer',
  nodeType: GraphQLAnswer,
})

const { connectionType: SlackMembersConnection } = connectionDefinitions({
  name: 'SlackMember',
  nodeType: GraphQLSlackMember,
})

const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
    viewer: {
      type: GraphQLUser,
      resolve: async (source, args, { rootValue }) => {
        let user = new db.user.AnonymousUser()

        if (!rootValue) {
          return user
        }

        user = await db.user.getUser(rootValue.uid)
        if (rootValue.a) {
          user.assumed = true
        }
        return user
      },
    },
  },
})

// Our Relay Mutations

const GraphQLCreateAnswerMutation = mutationWithClientMutationId({
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
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: ({ teamId, botId }) => db.bot.getBot(teamId, botId),
    },
    answerEdge: {
      type: GraphQLAnswerEdge,
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
  mutateAndGetPayload: async ({ title, body, botId: globalId }, { rootValue: root }) => {
    const { uid: createdBy } = root
    const { id: compositeId } = fromGlobalId(globalId)
    const [teamId, botId] = db.client.deconstructId(compositeId)
    const answer = await db.answer.createAnswer({
      title,
      body,
      botId,
      teamId,
      createdBy,
    })
    tracker.trackCreateAnswer({ root, id: answer.id })
    return { answer, teamId, botId }
  },
})

const GraphQLDeleteAnswerMutation = mutationWithClientMutationId({
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
  mutateAndGetPayload: async ({ id: globalId }, { rootValue: root }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [botId, id] = db.client.deconstructId(compositeId)
    const { teamId } = await db.answer.deleteAnswer(botId, id)
    tracker.trackDeleteAnswer({ id, root })
    return {
      botId,
      globalId,
      teamId,
    }
  },
})

const GraphQLUpdateAnswerMutation = mutationWithClientMutationId({
  name: 'UpdateAnswer',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    answer: {
      type: GraphQLAnswer,
      resolve: (answer) => answer,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, title, body }, { rootValue: root }) => {
    const { uid: updatedBy } = root
    const { id: compositeId } = fromGlobalId(globalId)
    const [botId, id] = db.client.deconstructId(compositeId)

    const answer = await db.answer.updateAnswer({
      body,
      title,
      botId,
      id,
      updatedBy,
    })
    tracker.trackUpdateAnswer({ root, id })
    return answer
  },
})

const GraphQLUpdateBotPurposeMutation = mutationWithClientMutationId({
  name: 'UpdateBotPurpose',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    // TODO this should be required once we properly default when the user is created
    purpose: { type: GraphQLString },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: (bot) => bot,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, purpose }, { rootValue: root }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [teamId, id] = db.client.deconstructId(compositeId)

    const bot = await db.bot.updatePurpose({
      teamId,
      id,
      purpose: purpose || null,
    })
    tracker.trackUpdateBotPurpose({ root, id })
    return bot
  },
})

const GraphQLUpdateBotPointsOfContactMutation = mutationWithClientMutationId({
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
  mutateAndGetPayload: async ({ id: globalId, pointsOfContact: globalIds }, { rootValue: root }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [teamId, id] = db.client.deconstructId(compositeId)
    debug('Points of contact', { globalIds })
    const pointsOfContact = globalIds.map((id) => fromGlobalId(id).id)

    const bot = await db.bot.updatePointsOfContact({
      pointsOfContact,
      teamId,
      id,
    })
    tracker.trackUpdateBotPointsOfContact({ root, id })
    return bot
  },
})

const GraphQLLogoutMutation = mutationWithClientMutationId({
  name: 'Logout',
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: async (_, { rootValue }) => {
    await db.token.deleteToken(rootValue.t.id, rootValue.uid)
    if (rootValue.a) {
      await db.admin.endToken(rootValue.a.id)
    }
    const user = new db.user.AnonymousUser()
    // this value is needed to invalidate the relay cache for the currently
    // logged in user
    user.id = rootValue.uid
    return user
  },
})

const GraphQLUpdateUserMutation = mutationWithClientMutationId({
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
  mutateAndGetPayload: async ({ id: globalId, role }, { rootValue: root }) => {
    const { id } = fromGlobalId(globalId)
    const { tid: teamId, uid: sourceUserId } = root
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
    tracker.trackUpdateUser({ root, id })
    return user
  },
})

const GraphQLInviteUserMutation = mutationWithClientMutationId({
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
      type: GraphQLUserEdge,
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
  mutateAndGetPayload: async ({ userId: globalId, role, username }, { rootValue: root }) => {
    const { id: userId } = fromGlobalId(globalId)
    const { tid: teamId, uid: invitedBy } = root
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

    tracker.trackInviteUser({ root, id: userId })
    return user
  },
})

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createAnswer: staffMutation(GraphQLCreateAnswerMutation),
    deleteAnswer: staffMutation(GraphQLDeleteAnswerMutation),
    updateAnswer: staffMutation(GraphQLUpdateAnswerMutation),
    logout: GraphQLLogoutMutation,
    updateBotPurpose: adminMutation(GraphQLUpdateBotPurposeMutation),
    updateBotPointsOfContact: adminMutation(GraphQLUpdateBotPointsOfContactMutation),
    updateUser: adminMutation(GraphQLUpdateUserMutation),
    inviteUser: adminMutation(GraphQLInviteUserMutation),
  }),
})

// Our Relay Schema

export default new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation,
})
