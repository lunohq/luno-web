import { GraphQLObjectType } from 'graphql'

import GraphQLFile from './GraphQLFile'
import { registerType } from './registry'

const GraphQLAttachment = new GraphQLObjectType({
  name: 'Attachment',
  description: 'An attachment within Luno',
  fields: () => ({
    file: {
      type: GraphQLFile,
      description: 'File associated with the Attachment',
    },
  }),
})

export default registerType({ type: GraphQLAttachment })
