import { GraphQLString, GraphQLList, GraphQLID, GraphQLObjectType } from 'graphql'
import { globalIdField, toGlobalId, connectionArgs, connectionFromArray } from 'graphql-relay'
import { db } from 'luno-core'

import Answers from '../connections/Answers'
import { registerType, nodeInterface } from './registry'

const GraphQLBot = new GraphQLObjectType({
  name: 'Bot',
  description: 'Bot within our system',
  fields: () => ({
    id: globalIdField('Bot', obj => db.client.compositeId(obj.teamId, obj.id)),
    purpose: {
      type: GraphQLString,
      description: 'Purpose of the Bot',
    },
    pointsOfContact: {
      type: new GraphQLList(GraphQLID),
      description: 'Points of contact of the Bot for escalation',
      resolve: (obj) => obj.pointsOfContact ? obj.pointsOfContact.map(id => toGlobalId('User', id)) : null,
    },
    answers: {
      type: Answers.connectionType,
      description: 'Answers configured for the Bot',
      args: connectionArgs,
      resolve: async (bot, args) => {
        const answers = await db.answer.getAnswers(bot.id)
        return connectionFromArray(answers, args)
      },
    },
  }),
  interfaces: [nodeInterface],
})

export default registerType({
  type: GraphQLBot,
  model: db.bot.Bot,
  resolve: id => {
    const [partitionKey, sortKey] = db.client.deconstructId(id)
    return db.bot.getBot(partitionKey, sortKey)
  },
})
