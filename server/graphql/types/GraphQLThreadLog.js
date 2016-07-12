import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import { connectionArgs, connectionFromArray, globalIdField } from 'graphql-relay'
import { db } from 'luno-core'

import getDataStore from '../../utils/getDataStore'
import ThreadEvents from '../connections/ThreadEvents'
import { registerType, nodeInterface } from './registry'

const GraphQLThreadLog = new GraphQLObjectType({
  name: 'ThreadLog',
  description: 'ThreadLog within our system',
  fields: () => ({
    id: globalIdField('ThreadLog', obj => db.client.compositeId(obj.teamId, obj.threadId)),
    channelName: {
      type: GraphQLString,
      description: 'The name of the channel the thread occurred in',
      resolve: async obj => {
        let name = obj.channelId
        if (obj.channelId.startsWith('D')) {
          name = 'Direct Message'
        } else {
          const dataStore = getDataStore()
          const channel = await dataStore.getChannelGroupOrDMById(obj.channelId)
          if (channel) {
            name = `#${channel.name}`
          }
        }
        return name
      },
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
      resolve: async obj => {
        let username = obj.userId
        const dataStore = getDataStore()
        const user = await dataStore.getUserById(obj.userId)
        if (user) {
          username = `@${user.name}`
        }
        return username
      },
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
