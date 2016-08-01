import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInputObjectType } from 'graphql'

import { registerType } from './registry'

const GraphQLFileInput = new GraphQLInputObjectType({
  name: 'FileInput',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'ID of the File',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of the File',
    },
    permalink: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Permanent link to the File',
    },
  }),
})

export default registerType({ type: GraphQLFileInput })
