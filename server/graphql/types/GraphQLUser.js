import {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql'
import {
  connectionArgs,
  connectionFromArray,
  globalIdField,
  fromGlobalId,
} from 'graphql-relay'
import { db, es } from 'luno-core'

import GraphQLTopic from './GraphQLTopic'
import GraphQLReply from './GraphQLReply'
import GraphQLThreadLog, { resolve } from './GraphQLThreadLog'
import GraphQLSearchResults from './GraphQLSearchResults'
import GraphQLAnalyzeResult from './GraphQLAnalyzeResult'
import GraphQLValidateResult from './GraphQLValidateResult'
import GraphQLExplainResult from './GraphQLExplainResult'
import Topics from '../connections/Topics'
import Bots from '../connections/Bots'
import ThreadLogs from '../connections/ThreadLogs'
import { connectionFromDynamodb, idFromCursor } from '../utils'

import registry, { registerType, nodeInterface } from './registry'

function getThreadLogId(item) {
  return db.client.compositeId(item.created, item.threadId)
}

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
    search: {
      type: GraphQLSearchResults,
      description: 'A search against the User\'s team\'s index',
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async ({ anonymous, teamId }, { query }) => {
        let results
        if (!anonymous) {
          results = await es.reply.search({ teamId, query, options: { explain: true, size: 100 } })
          results = { query, ...results }
        }
        return results
      },
    },
    analyze: {
      type: GraphQLAnalyzeResult,
      description: 'Analyze the given query',
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) },
        options: { type: GraphQLString },
      },
      resolve: async ({ anonymous }, { query, options: rawOptions }) => {
        let result
        if (!anonymous) {
          let options = {}
          if (rawOptions) {
            options = JSON.parse(rawOptions)
          }
          result = await es.reply.analyze({ query, ...options })
          result = {
            result,
            query,
            options,
          }
        }
        return result
      },
    },
    validate: {
      type: GraphQLValidateResult,
      description: 'Validate the given query',
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async ({ anonymous, teamId }, { query }) => {
        let result
        if (!anonymous) {
          result = await es.reply.validate({ teamId, query })
          result = {
            result,
            query,
          }
        }
        return result
      },
    },
    explain: {
      type: GraphQLExplainResult,
      description: 'Explain why a specific reply matched or didn\'t match the query',
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) },
        replyId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async ({ anonymous, teamId }, { query, replyId: globalId }) => {
        let result
        if (!anonymous) {
          const { id: compositeId } = fromGlobalId(globalId)
          const replyId = db.client.deconstructId(compositeId)[1]
          result = await es.reply.explain({ teamId, query, replyId })
        }
        return result
      },
    },
    reply: {
      type: GraphQLReply,
      description: 'A specific Reply to display',
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async ({ anonymous, teamId }, { id: globalId }) => {
        let reply
        if (!anonymous) {
          const { id: compositeId } = fromGlobalId(globalId)
          const id = db.client.deconstructId(compositeId)[1]
          reply = await db.reply.getReply({ teamId, id })
        }
        return reply
      },
    },
    topic: {
      type: GraphQLTopic,
      description: 'A specific Topic to display',
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async ({ anonymous, teamId }, { id: globalId }) => {
        let topic
        if (!anonymous) {
          const { id: compositeId } = fromGlobalId(globalId)
          const id = db.client.deconstructId(compositeId)[1]
          topic = await db.topic.getTopic({ teamId, id })
        }
        return topic
      },
    },
    threadLog: {
      type: GraphQLThreadLog,
      description: 'A specific ThreadLog to display',
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async ({ anonymous }, { id: globalId }) => {
        let log
        if (!anonymous) {
          const { id: compositeId } = fromGlobalId(globalId)
          log = await resolve(compositeId)
        }
        return log
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
    threadLogs: {
      type: ThreadLogs.connectionType,
      description: 'ThreadLogs the User has access to',
      args: connectionArgs,
      resolve: async ({ anonymous, teamId }, args) => {
        if (!anonymous) {
          let startKey
          if (args.after) {
            const compositeId = idFromCursor(args.after)
            const [created, threadId] = db.client.deconstructId(compositeId)
            startKey = { teamId, created, threadId }
          }
          const promises = [
            db.thread.getThreadLogs({ teamId, startKey, limit: args.first }),
            db.thread.getThreadLogPaginationBounds(teamId),
          ]
          const [logs, bounds] = await Promise.all(promises)
          return connectionFromDynamodb({ bounds, getId: getThreadLogId, data: logs })
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
      resolve: (source, args, { auth }) => auth && !!auth.a,
    },
    role: {
      type: registry.getType('UserRole'),
      description: 'Role of the user',
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
