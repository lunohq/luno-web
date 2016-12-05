import { GraphQLObjectType, GraphQLInt, GraphQLFloat, GraphQLList } from 'graphql'

import GraphQLSearchResultV2 from './GraphQLSearchResultV2'
import { registerType } from './registry'

const GraphQLSearchResultsV2 = new GraphQLObjectType({
  name: 'SearchResultsV2',
  description: 'Results from a search',
  fields: () => ({
    took: {
      type: GraphQLInt,
      description: 'Number of ms ES took to execute the search',
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
      type: new GraphQLList(GraphQLSearchResultV2),
      resolve: obj => obj.hits.hits,
    },
  }),
})

export default registerType({ type: GraphQLSearchResultsV2 })
