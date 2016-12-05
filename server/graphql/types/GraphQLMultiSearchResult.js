import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql'

import GraphQLSearchResultsV2 from './GraphQLSearchResultsV2'
import { registerType } from './registry'

const GraphQLMultiSearchResult = new GraphQLObjectType({
  name: 'MultiSearchResult',
  description: 'Results from a multi search',
  fields: () => ({
    responses: {
      type: new GraphQLList(GraphQLSearchResultsV2),
      description: 'Multi Search responses',
    },
    requestTook: {
      type: GraphQLInt,
      description: 'Number of ms for the request to complete',
    },
    analyzed: {
      type: GraphQLString,
      description: 'Result of running through luno_english analyzer',
      resolve: obj => {
        const { tokens } = obj.analyzed
        return tokens.map(({ token }) => token).join(' ')
      },
    },
  }),
})

export default registerType({ type: GraphQLMultiSearchResult })
