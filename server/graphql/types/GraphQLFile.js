import { GraphQLString, GraphQLObjectType } from 'graphql'

import { registerType } from './registry'

const GraphQLFile = new GraphQLObjectType({
  name: 'File',
  description: 'A file that has been uploaded',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: 'ID of the File',
      resolve: file => {
        let id = file.id
        if (file.lambda) {
          id = file.lambda.id
        }
        return id
      },
    },
    name: {
      type: GraphQLString,
      description: 'Name of the File',
      resolve: file => {
        let name = file.name
        if (file.lambda) {
          name = file.lambda.name
        }
        return name
      },
    },
    permalink: {
      type: GraphQLString,
      description: 'Permanent link to the File',
      resolve: file => {
        let permalink = file.permalink
        if (file.lambda) {
          permalink = file.lambda.permalink
        }
        return permalink
      },
    },
    key: {
      type: GraphQLString,
      description: 'Key where the file is stored',
      resolve: file => {
        let key = file.key
        if (file.s3) {
          key = file.s3.key
        }
        return key
      },
    },
    bucket: {
      type: GraphQLString,
      description: 'S3 bucket where the file is stored',
      resolve: file => {
        let bucket = file.bucket
        if (file.s3) {
          bucket = file.s3.bucket
        }
        return bucket
      },
    },
    created: {
      type: GraphQLString,
      description: 'Epoch timestamp when the file was created',
      resolve: file => {
        let created = file.created
        if (file.lambda) {
          created = file.lambda.created
        }
        return created
      },
    },
  }),
})

export default registerType({ type: GraphQLFile })
