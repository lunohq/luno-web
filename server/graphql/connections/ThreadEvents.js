import { connectionDefinitions } from 'graphql-relay'

import GraphQLThreadEvent from '../types/GraphQLThreadEvent'

export default connectionDefinitions({
  name: 'ThreadEvents',
  nodeType: GraphQLThreadEvent,
})
