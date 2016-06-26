import { GraphQLObjectType, GraphQLBoolean } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { db } from 'luno-core'

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
