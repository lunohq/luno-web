import { connectionDefinitions } from 'graphql-relay'

import GraphQLUser from '../types/GraphQLUser'

export default connectionDefinitions({
  name: 'User',
  nodeType: GraphQLUser,
})
