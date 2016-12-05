import {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID,
} from 'graphql'
import {
  connectionArgs,
  connectionFromArray,
  globalIdField,
  fromGlobalId,
} from 'graphql-relay'
import { db, es } from 'luno-core'
import request from 'request'
import Bluebird from 'bluebird'

import GraphQLTopic from './GraphQLTopic'
import GraphQLReply from './GraphQLReply'
import GraphQLThreadLog, { resolve } from './GraphQLThreadLog'
import GraphQLSearchResults from './GraphQLSearchResults'
import GraphQLMultiSearchResult from './GraphQLMultiSearchResult'
import GraphQLZendeskSearchResults from './GraphQLZendeskSearchResults'
import GraphQLAnalyzeResult from './GraphQLAnalyzeResult'
import GraphQLValidateResult from './GraphQLValidateResult'
import GraphQLExplainResult from './GraphQLExplainResult'
import Topics from '../connections/Topics'
import Bots from '../connections/Bots'
import ThreadLogs from '../connections/ThreadLogs'
import { connectionFromDynamodb, idFromCursor } from '../utils'
import logger from '../../logger'

import registry, { registerType, nodeInterface } from './registry'

const get = Bluebird.promisify(request.get, { multiArgs: true })

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
      resolve: async (user, args, { auth }) => {
        if (!user.anonymous) {
          let team
          try {
            team = await db.team.getTeam(user.teamId)
          } catch (err) {
            logger.error('Error resolving team', { err, auth })
            throw err
          }
          return team
        }
        return null
      },
    },
    bots: {
      type: Bots.connectionType,
      description: 'Bots the User has access to',
      args: connectionArgs,
      resolve: async (user, args, { auth }) => {
        if (!user.anonymous) {
          let bots
          try {
            bots = await db.bot.getBots(user.teamId)
          } catch (err) {
            logger.error('Error resolving bots', { auth, err })
            throw err
          }
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
      resolve: async ({ anonymous, teamId }, { query }, { auth }) => {
        let results
        if (!anonymous) {
          const start = Date.now()
          try {
            results = await es.reply.search({ teamId, query, options: { explain: true, size: 100 } })
          } catch (err) {
            logger.error('Error with search', { err, auth })
            throw err
          }
          const end = Date.now()
          results = { query, requestTook: end - start, ...results }
        }
        return results
      },
    },
    msearch: {
      type: GraphQLMultiSearchResult,
      description: 'A v2 search against the User\'s team\'s index',
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async ({ anonymous, teamId }, { query }, { auth }) => {
        let results
        if (!anonymous) {
          const start = Date.now()
          let responses
          try {
            const response = await es.reply.msearch({ teamId, query, options: { explain: true, size: 100 } })
            responses = response.responses
          } catch (err) {
            logger.error('Error with msearch', { err, query, auth })
            throw err
          }
          const end = Date.now()
          let analyzed
          try {
            analyzed = await es.reply.analyze({ query, analyzer: 'luno_english' })
          } catch (err) {
            logger.error('Error analyzing query', { err, query, auth })
            throw err
          }
          results = { requestTook: end - start, responses, analyzed }
        }
        return results
      },
    },
    zsearch: {
      type: GraphQLZendeskSearchResults,
      description: 'Simple endpoint to query a zendesk help center via api',
      args: {
        domain: { type: new GraphQLNonNull(GraphQLString) },
        query: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, { query, domain }) => {
        const endpoint = `http://${domain}/api/v2/help_center/articles/search.json?query=${query}`
        const start = Date.now()
        const result = await get(endpoint)
        const end = Date.now()
        const body = JSON.parse(result[1])
        return { requestTook: end - start, ...body }
      },
    },
    analyze: {
      type: GraphQLAnalyzeResult,
      description: 'Analyze the given query',
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) },
        options: { type: GraphQLString },
      },
      resolve: async ({ anonymous }, { query, options: rawOptions }, { auth }) => {
        let result
        if (!anonymous) {
          let options = { analyzer: 'default_search' }
          if (rawOptions) {
            options = JSON.parse(rawOptions)
          }
          let analyzeResult
          try {
            analyzeResult = await es.reply.analyze({ query, ...options })
          } catch (err) {
            logger.error('Error analyzing query', { query, options, err, auth })
            throw err
          }
          result = { result: analyzeResult }
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
      resolve: async ({ anonymous, teamId }, { query }, { auth }) => {
        let result
        if (!anonymous) {
          try {
            result = await es.reply.validate({ teamId, query })
          } catch (err) {
            logger.error('Error validating query', { query, err, auth })
            throw err
          }
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
        tier: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async ({ anonymous, teamId }, { query, replyId: globalId, tier }, { auth }) => {
        let result
        if (!anonymous) {
          const { id: compositeId } = fromGlobalId(globalId)
          const replyId = db.client.deconstructId(compositeId)[1]
          try {
            result = await es.reply.explain({ teamId, query, replyId, tier })
          } catch (err) {
            logger.error('Error explaining query', { query, replyId, tier, err, auth })
            throw err
          }
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
      resolve: async ({ anonymous, teamId }, { id: globalId }, { auth }) => {
        let reply
        if (!anonymous) {
          const { id: compositeId } = fromGlobalId(globalId)
          const id = db.client.deconstructId(compositeId)[1]
          try {
            reply = await db.reply.getReply({ teamId, id })
          } catch (err) {
            logger.error('Error fetching reply', { id, err, auth })
            throw err
          }
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
      resolve: async ({ anonymous, teamId }, { id: globalId }, { auth }) => {
        let topic
        if (!anonymous) {
          const { id: compositeId } = fromGlobalId(globalId)
          const id = db.client.deconstructId(compositeId)[1]
          try {
            topic = await db.topic.getTopic({ teamId, id })
          } catch (err) {
            logger.error('Error fetching topic', { id, err, auth })
            throw err
          }
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
      resolve: async ({ anonymous }, { id: globalId }, { auth }) => {
        let log
        if (!anonymous) {
          const { id: compositeId } = fromGlobalId(globalId)
          try {
            log = await resolve(compositeId)
          } catch (err) {
            logger.error('Error resolving threadLog', { compositeId, err, auth })
            throw err
          }
        }
        return log
      },
    },
    defaultTopic: {
      type: GraphQLTopic,
      description: 'The default Topic the User has access to',
      resolve: async (user, args, { auth }) => {
        let topic
        if (!user.anonymous) {
          try {
            topic = await db.topic.getDefaultTopic(user.teamId)
          } catch (err) {
            logger.error('Error fetching default topic', { err, auth })
            throw err
          }
        }
        return topic
      },
    },
    topics: {
      type: Topics.connectionType,
      description: 'Topics the User has access to',
      args: connectionArgs,
      resolve: async (user, args, { auth }) => {
        let topics
        if (!user.anonymous) {
          try {
            topics = await db.topic.getTopics(user.teamId)
          } catch (err) {
            logger.error('Error fetching topics', { auth, err })
            throw err
          }
          return connectionFromArray(topics, args)
        }
        return null
      },
    },
    threadLogs: {
      type: ThreadLogs.connectionType,
      description: 'ThreadLogs the User has access to',
      args: connectionArgs,
      resolve: async ({ anonymous, teamId }, args, { auth }) => {
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
          let result
          try {
            result = await Promise.all(promises)
          } catch (err) {
            logger.error('Error fetching threadLogs', { err, auth, startKey, limit: args.first })
            throw err
          }
          const [logs, bounds] = result
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
