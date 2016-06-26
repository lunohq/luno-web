import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray,
  globalIdField,
} from 'graphql-relay'

import { db } from 'luno-core'

import { getMembers } from '../../actions/slack'
import SlackMembers from '../connections/SlackMembers'
import Users from '../connections/Users'

import { registerType, nodeInterface } from './registry'

const GraphQLTeam = new GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: globalIdField('Team'),
    name: {
      type: GraphQLString,
      description: 'Team domain (maps to slack domain)',
    },
    createdBy: globalIdField('User', obj => obj.createdBy),
    members: {
      type: SlackMembers.connectionType,
      description: 'Members of the slack team',
      args: connectionArgs,
      resolve: async (team, args) => {
        const members = await getMembers(team.id)
        return connectionFromArray(members, args)
      },
    },
    users: {
      type: Users.connectionType,
      description: 'Users within Luno',
      args: connectionArgs,
      resolve: async (team, args) => {
        const users = await db.user.getUsers(team.id)
        return connectionFromArray(users, args)
      },
    },
    staff: {
      type: Users.connectionType,
      description: 'Admin or Trainers with Luno',
      args: connectionArgs,
      resolve: async (team, args) => {
        const users = await db.user.getStaff(team.id)
        return connectionFromArray(users, args)
      },
    },
    admins: {
      type: Users.connectionType,
      description: 'Admins within Luno',
      args: connectionArgs,
      resolve: async (team, args) => {
        const admins = await db.user.getAdmins(team.id)
        return connectionFromArray(admins, args)
      },
    },
  }),
  interfaces: [nodeInterface],
})

export default registerType({
  type: GraphQLTeam,
  model: db.team.Team,
  resolve: id => db.team.getTeam(id),
})
