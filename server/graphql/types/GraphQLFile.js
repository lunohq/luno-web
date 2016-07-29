import { GraphQLString, GraphQLObjectType } from 'graphql'

import { registerType } from './registry'

const GraphQLFile = new GraphQLObjectType({
  name: 'File',
  description: 'A file that has been uploaded',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: 'ID of the File',
      resolve: file => file.lambda.id,
    },
    name: {
      type: GraphQLString,
      description: 'Name of the File',
      resolve: file => file.lambda.name,
    },
    permalink: {
      type: GraphQLString,
      description: 'Permanent link to the File',
      resolve: file => file.lambda.permalink,
    },
    key: {
      type: GraphQLString,
      description: 'Key where the file is stored',
      resolve: file => file.s3.key,
    },
    bucket: {
      type: GraphQLString,
      description: 'S3 bucket where the file is stored',
      resolve: file => file.s3.bucket,
    },
    created: {
      type: GraphQLString,
      description: 'Epoch timestamp when the file was created',
      resolve: file => file.lambda.created,
    },
  }),
})

export default registerType({ type: GraphQLFile })
