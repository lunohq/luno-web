import { GraphQLObjectType, GraphQLInt, GraphQLFloat, GraphQLList, GraphQLString } from 'graphql'

import GraphQLSearchResult from './GraphQLSearchResult'
import { registerType } from './registry'

const GraphQLSearchResults = new GraphQLObjectType({
  name: 'SearchResults',
  description: 'Results from a search',
  fields: () => ({
    took: {
      type: GraphQLInt,
      description: 'Number of ms ES took to execute the search',
    },
    requestTook: {
      type: GraphQLInt,
      description: 'Number of ms for the request to complete',
    },
    totalResults: {
      type: GraphQLInt,
      description: 'Total number of documents that matched',
      resolve: obj => obj.hits.total
    },
    maxScore: {
      type: GraphQLFloat,
      description: 'The max score returned from all the documents',
      resolve: obj => obj.hits.max_score,
    },
    results: {
      type: new GraphQLList(GraphQLSearchResult),
      resolve: obj => obj.hits.hits,
    },
    query: {
      type: GraphQLString,
      description: 'The search query',
    },
  }),
})

export default registerType({ type: GraphQLSearchResults })
