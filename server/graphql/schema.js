import { GraphQLSchema } from 'graphql'

import GraphQLQuery from './types/GraphQLQuery'
import GraphQLMutation from './types/GraphQLMutation'

export default new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation,
})
