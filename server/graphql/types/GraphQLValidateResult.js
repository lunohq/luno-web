import { GraphQLObjectType, GraphQLString } from 'graphql'
import { registerType } from './registry'

const GraphQLValidateResult = new GraphQLObjectType({
  name: 'ValidateResult',
  description: 'The result of running a query through the validate endpoint of ES',
  fields: () => ({
    query: {
      type: GraphQLString,
      description: 'The query that was validated',
    },
    result: {
      type: GraphQLString,
      description: 'The result of running validate',
      resolve: obj => obj.result.explanations[0].explanation,
    },
  }),
})

export default registerType({ type: GraphQLValidateResult })
