import { connectionDefinitions } from 'graphql-relay'

import GraphQLReply from '../types/GraphQLReply'

export default connectionDefinitions({
  name: 'Reply',
  nodeType: GraphQLReply,
})
