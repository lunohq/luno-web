import { GraphQLString, GraphQLInputObjectType } from 'graphql'

import { registerType } from './registry'

const GraphQLFileInput = new GraphQLInputObjectType({
  name: 'FileInput',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: 'ID of the File',
    },
    name: {
      type: GraphQLString,
      description: 'Name of the File',
    },
    permalink: {
      type: GraphQLString,
      description: 'Permanent link to the File',
    },
    key: {
      type: GraphQLString,
      description: 'Key where the file is stored',
    },
    bucket: {
      type: GraphQLString,
      description: 'S3 bucket where the file is stored',
    },
    created: {
      type: GraphQLString,
      description: 'Epoch timestamp when the file was created',
    },
  }),
})

export default registerType({ type: GraphQLFileInput })
