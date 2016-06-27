import { GraphQLString, GraphQLObjectType } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { db } from 'luno-core'

import { registerType, nodeInterface } from './registry'

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
    changed: {
      type: GraphQLString,
      description: 'Date the Reply was changed',
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
