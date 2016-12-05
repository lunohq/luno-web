import { GraphQLObjectType, GraphQLInt, GraphQLList } from 'graphql'

import GraphQLZendeskSearchResult from './GraphQLZendeskSearchResult'
import { registerType } from './registry'

const GraphQLZendeskSearchResults = new GraphQLObjectType({
  name: 'ZendeskSearchResults',
  description: 'Results from zendesk search',
  fields: () => ({
    requestTook: {
      type: GraphQLInt,
      description: 'Number of ms for the request to complete',
    },
    pages: {
      type: GraphQLInt,
      description: 'Total number of pages',
      resolve: obj => obj.page_count,
    },
    totalResults: {
      type: GraphQLInt,
      description: 'Total number of results',
      resolve: obj => obj.count,
    },
    results: {
      type: new GraphQLList(GraphQLZendeskSearchResult),
    },
  }),
})

export default registerType({ type: GraphQLZendeskSearchResults })
