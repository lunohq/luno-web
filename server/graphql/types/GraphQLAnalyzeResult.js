import { GraphQLObjectType, GraphQLString } from 'graphql'
import { registerType } from './registry'
import YAML from 'yamljs'

const GraphQLAnalyzeResult = new GraphQLObjectType({
  name: 'AnalyzeResult',
  description: 'The result of running the query through the given analyzer',
  fields: () => ({
    result: {
      type: GraphQLString,
      description: 'Results from analyzing the query',
      resolve: obj => YAML.stringify(obj.result, 4),
    },
  })
})

export default registerType({ type: GraphQLAnalyzeResult })
