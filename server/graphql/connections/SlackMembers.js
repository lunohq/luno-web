import { connectionDefinitions } from 'graphql-relay'

import GraphQLSlackMember from '../types/GraphQLSlackMember'

export default connectionDefinitions({
  name: 'SlackMember',
  nodeType: GraphQLSlackMember,
})
