import { GraphQLObjectType, GraphQLFloat, GraphQLString } from 'graphql'
import { registerType } from './registry'
import YAML from 'yamljs'

const GraphQLSearchResult = new GraphQLObjectType({
  name: 'SearchResult',
  description: 'Search Result',
  fields: () => ({
    score: {
      type: GraphQLFloat,
      description: 'Score of the Search Result',
      resolve: obj => obj._score,
    },
    id: {
      type: GraphQLString,
      description: 'ID of the Reply that was indexed',
      resolve: obj => obj._id,
    },
    changed: {
      type: GraphQLString,
      description: 'Changed date of the Reply',
      resolve: obj => obj._source.changed,
    },
    body: {
      type: GraphQLString,
      description: 'Body of the Reply',
      resolve: obj => obj._source.body,
    },
    displayTitle: {
      type: GraphQLString,
      description: 'Display title of the Reply',
      resolve: obj => obj._source.displayTitle,
    },
    explanation: {
      type: GraphQLString,
      description: 'YAML explanation for the result score',
      resolve: obj => obj._explanation && YAML.stringify(obj._explanation, 20),
    },
  }),
})

export default registerType({ type: GraphQLSearchResult })
