import { GraphQLString, GraphQLObjectType } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { db } from 'luno-core'

import registry, { registerType, nodeInterface } from './registry'

const GraphQLReply = new GraphQLObjectType({
  name: 'Reply',
  description: 'A reply within luno',
  fields: () => ({
    id: globalIdField('Reply', obj => db.client.compositeId(obj.teamId, obj.id)),
    title: {
      type: GraphQLString,
      description: 'Title of the Reply',
    },
    body: {
      type: GraphQLString,
      description: 'Body of the Reply',
    },
    keywords: {
      type: GraphQLString,
      description: 'Comma delimited list of keywords to index with the Reply',
    },
    changed: {
      type: GraphQLString,
      description: 'Date the Reply was changed',
    },
    updatedBy: {
      type: registry.getType('User'),
      description: 'The User who last updated the reply',
      resolve: async ({ updatedBy, createdBy, ...other }) => {
        if (other._updatedByUser) {
          return other._updatedByUser
        }

        const userId = updatedBy || createdBy
        let user
        if (userId) {
          user = db.user.getUser(userId)
        }
        return user
      },
    },
    topic: {
      type: registry.getType('Topic'),
      description: 'The Topic the reply belongs to',
      resolve: async ({ teamId, id }) => {
        const topics = await db.reply.getTopicsForReply({ teamId, id })
        return topics[0]
      },
    },
  }),
  interfaces: [nodeInterface],
})

export default registerType({
  type: GraphQLReply,
  model: db.reply.Reply,
  resolve: compositeId => {
    const [teamId, id] = db.client.deconstructId(compositeId)
    return db.reply.getReply({ teamId, id })
  },
})
