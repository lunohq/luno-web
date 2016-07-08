import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import { connectionArgs, connectionFromArray, globalIdField } from 'graphql-relay'
import { db } from 'luno-core'

import { registerType, nodeInterface } from './registry'
import ThreadEvents from '../connections/ThreadEvents'

const GraphQLThreadLog = new GraphQLObjectType({
  name: 'ThreadLog',
  description: 'ThreadLog within our system',
  fields: () => ({
    id: globalIdField('ThreadLog', obj => db.client.compositeId(obj.teamId, obj.threadId)),
    channelName: {
      type: GraphQLString,
      description: 'The name of the channel the thread occurred in',
      resolve: obj => obj.channelId.startsWith('D') ? 'Direct Message' : obj.channelId,
    },
    created: {
      type: GraphQLString,
      description: 'The timestamp when the thread was created',
    },
    message: {
      type: GraphQLString,
      description: 'The message that started the thread',
      resolve: obj => obj.message.message.text
    },
    username: {
      type: GraphQLString,
      description: 'The slack username of the user the thread refers to',
      resolve: obj => `@${obj.userId}`,
    },
    length: {
      type: GraphQLInt,
      description: 'The number of events that occurred within the thread',
    },
    status: {
      type: GraphQLInt,
      description: 'The status of the thread',
    },
    events: {
      type: ThreadEvents.connectionType,
      description: 'Events within the ThreadLog',
      args: connectionArgs,
      resolve: async (log, args) => {
        const events = await db.thread.getThreadEvents(log.threadId)
        return connectionFromArray(events, args)
      },
    },
  }),
  interfaces: [nodeInterface],
})

export function resolve(compositeId) {
  const [teamId, threadId] = db.client.deconstructId(compositeId)
  return db.thread.getThreadLog({ teamId, threadId })
}

export default registerType({
  type: GraphQLThreadLog,
  model: db.thread.ThreadLog,
  resolve,
})
