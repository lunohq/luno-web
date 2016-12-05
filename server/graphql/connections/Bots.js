import { connectionDefinitions } from 'graphql-relay'

import GraphQLBot from '../types/GraphQLBot'

export default connectionDefinitions({
  name: 'Bot',
  nodeType: GraphQLBot,
})
