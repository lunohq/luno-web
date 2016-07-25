import { GraphQLObjectType, GraphQLString } from 'graphql'
import { registerType } from './registry'
import YAML from 'yamljs'

const GraphQLAnalyzeResult = new GraphQLObjectType({
  name: 'AnalyzeResult',
  description: 'The result of running the query through the given analyzer',
  fields: () => ({
    options: {
      type: GraphQLString,
      description: 'Analyze options',
      resolve: obj => JSON.stringify(obj.options, undefined, 4),
    },
    result: {
      type: GraphQLString,
      description: 'Results from analyzing the query',
      resolve: obj => YAML.stringify(obj.result, 4),
    },
    query: {
      type: GraphQLString,
      description: 'Query that was analyzed',
    },
  })
})

export default registerType({ type: GraphQLAnalyzeResult })
