import {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'
import {
  connectionArgs,
  connectionFromArray,
  globalIdField,
} from 'graphql-relay'
import { db } from 'luno-core'

import GraphQLTopic from './GraphQLTopic'
import Topics from '../connections/Topics'
import Bots from '../connections/Bots'

import registry, { registerType, nodeInterface } from './registry'

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
      type: registry.getType('Team'),
      description: 'The Team the User belongs to',
      resolve: user => {
        if (!user.anonymous) {
          return db.team.getTeam(user.teamId)
        }
        return null
      },
    },
    bots: {
      type: Bots.connectionType,
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
    defaultTopic: {
      type: GraphQLTopic,
      description: 'The default Topic the User has access to',
      resolve: (user) => {
        if (!user.anonymous) {
          return db.topic.getDefaultTopic(user.teamId)
        }
        return null
      },
    },
    topics: {
      type: Topics.connectionType,
      description: 'Topics the User has access to',
      args: connectionArgs,
      resolve: async (user, args) => {
        if (!user.anonymous) {
          const topics = await db.topic.getTopics(user.teamId)
          return connectionFromArray(topics, args)
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
      type: registry.getType('UserRole'),
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

export default registerType({
  type: GraphQLUser,
  model: db.user.User,
  resolve: id => db.user.getUser(id),
})
