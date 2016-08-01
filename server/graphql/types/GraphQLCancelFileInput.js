import { GraphQLNonNull, GraphQLString, GraphQLInputObjectType } from 'graphql'

import { registerType } from './registry'

const GraphQLCancelFileInput = new GraphQLInputObjectType({
  name: 'CancelFileInput',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the file being cancelled',
    },
    mutationId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The mutation id of the file being cancelled',
    },
  }),
})

export default registerType({ type: GraphQLCancelFileInput })
