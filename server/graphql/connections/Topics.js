import { connectionDefinitions } from 'graphql-relay'

import GraphQLTopic from '../types/GraphQLTopic'

export default connectionDefinitions({
  name: 'Topic',
  nodeType: GraphQLTopic,
})
