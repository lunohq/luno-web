import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { db } from 'luno-core'

import { getMember, SlackMember } from '../../actions/slack'

import { registerType, nodeInterface } from './registry'
import GraphQLSlackMemberProfile from './GraphQLSlackMemberProfile'

const GraphQLSlackMember = new GraphQLObjectType({
  name: 'SlackMember',
  fields: () => ({
    id: globalIdField('SlackMember', obj => db.client.compositeId(obj.teamId, obj.id)),
    userId: globalIdField('User', obj => obj.id),
    name: {
      type: GraphQLString,
      description: 'Member\'s slack username',
    },
    profile: {
      type: GraphQLSlackMemberProfile,
      description: 'Member\'s slack profile',
    },
  }),
  interfaces: [nodeInterface],
})

export default registerType({
  type: GraphQLSlackMember,
  model: SlackMember,
  resolve: compositeId => {
    const [teamId, id] = db.client.deconstructId(compositeId)
    return getMember(teamId, id)
  },
})
