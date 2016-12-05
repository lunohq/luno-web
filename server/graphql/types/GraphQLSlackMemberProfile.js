import { GraphQLObjectType, GraphQLString } from 'graphql'

import { registerType } from './registry'

const GraphQLSlackMemberProfile = new GraphQLObjectType({
  name: 'SlackMemberProfile',
  description: 'Slack member profile object',
  fields: {
    realName: {
      type: GraphQLString,
      description: 'Slack user\'s full name',
      resolve: obj => obj.real_name,
    },
    email: {
      type: GraphQLString,
      description: 'Slack user email',
    },
  },
})

export default registerType({
  type: GraphQLSlackMemberProfile,
})
