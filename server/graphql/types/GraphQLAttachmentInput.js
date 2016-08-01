import { GraphQLNonNull, GraphQLInputObjectType } from 'graphql'

import GraphQLFileInput from './GraphQLFileInput'
import { registerType } from './registry'

const GraphQLAttachmentInput = new GraphQLInputObjectType({
  name: 'AttachmentInput',
  fields: () => ({
    file: {
      type: new GraphQLNonNull(GraphQLFileInput),
      description: 'File for the Attachment',
    },
  }),
})

export default registerType({ type: GraphQLAttachmentInput })
