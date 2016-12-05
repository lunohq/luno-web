import { connectionDefinitions } from 'graphql-relay'

import GraphQLThreadLog from '../types/GraphQLThreadLog'

export default connectionDefinitions({
  name: 'ThreadLog',
  nodeType: GraphQLThreadLog,
})
