import { GraphQLObjectType, GraphQLString } from 'graphql'

import getDataStore from '../../utils/getDataStore'
import { registerType } from './registry'
import GraphQLThreadEventType from './GraphQLThreadEventType'

const GraphQLThreadEventMessage = new GraphQLObjectType({
  name: 'ThreadEventMessage',
  description: 'Message within a thread event',
  fields: {
    event: {
      type: GraphQLString,
      description: 'The event that triggered Luno recognizing the message',
    },
    type: {
      type: GraphQLString,
      description: 'Type of message',
    },
    user: {
      type: GraphQLString,
      description: 'User who sent the message',
      resolve: async obj => {
        let name = obj.user
        const dataStore = getDataStore()
        const user = await dataStore.getUserById(obj.user)
        if (user) {
          name = user.name
        }
        return name
      },
    },
    ts: {
      type: GraphQLString,
      description: 'Timestamp when the message was sent',
    },
    text: {
      type: GraphQLString,
      description: 'Text of the message',
    },
  },
})

const GraphQLThreadEvent = new GraphQLObjectType({
  name: 'ThreadEvent',
  description: 'ThreadEvent within a Thread',
  fields: {
    created: {
      type: GraphQLString,
      description: 'When the event occurred',
    },
    message: {
      type: GraphQLThreadEventMessage,
      description: 'The message associated with the event, if any.',
      resolve: obj => obj.message && obj.message.message ? obj.message.message : obj.message,
    },
    type: {
      type: GraphQLThreadEventType,
      description: 'Type of ThreadEvent',
    },
    meta: {
      type: GraphQLString,
      description: 'Meta data stored with the event',
      resolve: obj => JSON.stringify(obj.meta),
    },
  },
})

export default registerType({ type: GraphQLThreadEvent })
