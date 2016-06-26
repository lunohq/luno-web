import { GraphQLString, GraphQLObjectType } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { db } from 'luno-core'

import { registerType, nodeInterface } from './registry'

const GraphQLAnswer = new GraphQLObjectType({
  name: 'Answer',
  description: 'An answer that is tied to a Bot',
  fields: () => ({
    id: globalIdField('Answer', obj => db.client.compositeId(obj.botId, obj.id)),
    title: {
      type: GraphQLString,
      description: 'Title of the Answer',
    },
    body: {
      type: GraphQLString,
      description: 'Body of the Answer',
    },
    changed: {
      type: GraphQLString,
      description: 'Date the Answer was changed',
    },
  }),
  interfaces: [nodeInterface],
})

export default registerType({
  type: GraphQLAnswer,
  model: db.answer.Answer,
  resolve: id => {
    const [partitionKey, sortKey] = db.client.deconstructId(id)
    return db.answer.getAnswer(partitionKey, sortKey)
  },
})
