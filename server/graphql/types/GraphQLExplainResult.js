import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql'
import { registerType } from './registry'
import YAML from 'yamljs'

const GraphQLExplainResult = new GraphQLObjectType({
  name: 'ExplainResult',
  description: 'The result of running explain with a specific reply id',
  fields: () => ({
    matched: {
      type: GraphQLBoolean,
      description: 'Boolean for whether or not the reply matched',
    },
    explanation: {
      type: GraphQLString,
      description: 'The explanation for why the result matched or didn\'t match',
      resolve: obj => YAML.stringify(obj.explanation, 20),
    },
  }),
})

export default registerType({ type: GraphQLExplainResult })
