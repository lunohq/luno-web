import { connectionDefinitions } from 'graphql-relay'

import GraphQLAnswer from '../types/GraphQLAnswer'

export default connectionDefinitions({
  name: 'Answer',
  nodeType: GraphQLAnswer,
})
