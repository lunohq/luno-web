import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from 'graphql'
import { globalIdField, connectionArgs, connectionFromArray } from 'graphql-relay'
import { db } from 'luno-core'

import Replies from '../connections/Replies'
import { registerType, nodeInterface } from './registry'

const GraphQLTopic = new GraphQLObjectType({
  name: 'Topic',
  description: 'Topic within our system',
  fields: () => ({
    id: globalIdField('Topic', obj => db.client.compositeId(obj.teamId, obj.id)),
    isDefault: {
      type: GraphQLBoolean,
      description: 'Boolean indicating this is the default topic',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the Topic',
    },
    replies: {
      type: Replies.connectionType,
      description: 'Replies within the topic',
      args: connectionArgs,
      resolve: async ({ teamId, id: topicId }, args) => {
        const replies = await db.reply.getRepliesForTopic({ teamId, topicId })
        return connectionFromArray(replies, args)
      },
    },
  }),
  interfaces: [nodeInterface],
})

export default registerType({
  type: GraphQLTopic,
  model: db.topic.Topic,
  resolve: compositeId => {
    const [teamId, id] = db.client.deconstructId(compositeId)
    return db.topic.getTopic({ teamId, id })
  },
})
