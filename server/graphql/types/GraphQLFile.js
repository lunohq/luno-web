import { GraphQLString, GraphQLObjectType } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { db } from 'luno-core'

import { registerType, nodeInterface } from './registry'

const GraphQLFile = new GraphQLObjectType({
  name: 'File',
  description: 'A file that has been uploaded',
  fields: () => ({
    id: globalIdField('File'),
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
  interfaces: [nodeInterface],
})

export default registerType({
  type: GraphQLFile,
  model: db.file.File,
  resolve: (id, { auth: { tid: teamId } }) => db.file.getFile({ teamId, id }),
})
