import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from 'graphql'
import { globalIdField, connectionArgs, connectionFromArray } from 'graphql-relay'
import { db } from 'luno-core'

import Replies from '../connections/Replies'
import { newLunoUser } from '../utils'
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
        const userIds = {}
        replies.forEach(reply => {
          const updatedBy = reply.updatedBy || reply.createdBy
          if (updatedBy) {
            userIds[updatedBy] = true
          }
        })
        const users = await db.user.getUsersWithIds(Object.keys(userIds))
        const usersMap = {}
        users.forEach(user => {
          usersMap[user.id] = user
        })
        replies.forEach(reply => {
          const user = usersMap[reply.updatedBy || reply.createdBy]
          if (user) {
            reply._updatedByUser = user
          } else if (reply.createdBy) {
            reply._updatedByUser = newLunoUser(reply.createdBy)
          }
        })
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
