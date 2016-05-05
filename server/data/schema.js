/* eslint-disable no-unused-vars, no-use-before-define */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  offsetToCursor,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay'

import { db } from 'luno-core'

import { getMember, getMembers, SlackMember } from '../actions/slack'

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'Team') {
      return db.team.getTeam(id)
    } else if (type === 'User') {
      return db.user.getUser(id)
    } else if (type === 'Bot') {
      const [partitionKey, sortKey] = db.client.deconstructId(id)
      return db.bot.getBot(partitionKey, sortKey)
    } else if (type === 'Answer') {
      const [partitionKey, sortKey] = db.client.deconstructId(id)
      return db.answer.getAnswer(partitionKey, sortKey)
    } else if (type === 'Regex') {
      const [partitionKey, sortKey] = db.client.deconstructId(id)
      return db.regex.getRegex(partitionKey, sortKey)
    } else if (type === 'SlackMember') {
      const [teamId, id] = db.client.deconstructId(id)
      return getMember(teamId, id)
    }
    return null
  },
  (obj) => {
    if (obj instanceof db.team.Team) {
      return GraphQLTeam
    } else if (obj instanceof db.user.User) {
      return GraphQLUser
    } else if (obj instanceof db.bot.Bot) {
      return GraphQLBot
    } else if (obj instanceof db.answer.Answer) {
      return GraphQLAnswer
    } else if (obj instanceof db.regex.Regex) {
      return GraphQLRegex
    } else if (obj instanceof SlackMember) {
      return GraphQLSlackMember
    }
    return null
  },
)

// Our GraphQL Types

const GraphQLSlackBot = new GraphQLObjectType({
  name: 'SlackBot',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Our main slack bot id for the Team',
    },
  },
})

const GraphQLSlackInfo = new GraphQLObjectType({
  name: 'SlackInfo',
  description: 'Slack info related to a Team',
  fields: {
    bot: { type: GraphQLSlackBot },
  },
})

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

const GraphQLTeam = new GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: globalIdField('Team'),
    name: {
      type: GraphQLString,
      description: 'Team domain (maps to slack domain)',
    },
    slack: {
      type: GraphQLSlackInfo,
      description: 'Slack info related to the Team',
    },
    members: {
      type: SlackMembersConnection,
      description: 'Members of the slack team',
      args: connectionArgs,
      resolve: async (team, args) => {
        const members = await getMembers(team.id)
        return connectionFromArray(members, args)
      },
    },
  }),
  interfaces: [nodeInterface],
})

const GraphQLSlackMember = new GraphQLObjectType({
  name: 'SlackMember',
  fields: () => ({
    id: globalIdField('SlackMember', obj => db.client.compositeId(obj.teamId, obj.id)),
    userId: {
      type: GraphQLString,
      description: 'Slack user id',
      resolve: obj => obj.id,
    },
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

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  description: 'User within our system',
  fields: () => ({
    id: globalIdField('User'),
    fullName: {
      type: GraphQLString,
      description: 'The full name of the User',
    },
    team: {
      type: GraphQLTeam,
      description: 'The Team the User belongs to',
      resolve: user => db.team.getTeam(user.teamId),
    },
    bots: {
      type: BotsConnection,
      description: 'Bots the User has access to',
      args: connectionArgs,
      resolve: async (user, args) => {
        if (!user.anonymous) {
          const bots = await db.bot.getBots(user.teamId)
          return connectionFromArray(bots, args)
        }
        return null
      },
    },
    anonymous: {
      type: GraphQLBoolean,
      description: 'Boolean indicating whether or not the user is authenticated',
    },
  }),
  interfaces: [nodeInterface],
})

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
      type: new GraphQLList(GraphQLString),
      description: 'Points of contact of the Bot for escalation',
    },
    answers: {
      type: AnswersConnection,
      description: 'Answers configured for the Bot',
      args: connectionArgs,
      resolve: async (bot, args) => {
        const answers = await db.answer.getAnswers(bot.id)
        return connectionFromArray(answers, args)
      },
    },
    regexes: {
      type: RegexesConnection,
      description: 'Regexes that have been configured for the Bot',
      args: connectionArgs,
      resolve: async (bot, args) => {
        const regexes = await db.regex.getRegexes(bot.id)
        return connectionFromArray(regexes, args)
      },
    },
  }),
  interfaces: [nodeInterface],
})

const GraphQLAnswer = new GraphQLObjectType({
  name: 'Answer',
  description: 'An answer that is tied to a Bot',
  fields: () => ({
    id: globalIdField('Answer', obj => db.client.compositeId(obj.botId, obj.id)),
    title: {
      type: GraphQLString,
      description: 'Title of the Answer',
    },
    body: {
      type: GraphQLString,
      description: 'Body of the Answer',
    },
  }),
  interfaces: [nodeInterface],
})

const GraphQLRegex = new GraphQLObjectType({
  name: 'Regex',
  description: 'A regex that is tied to a Bot',
  fields: () => ({
    id: globalIdField('Regex', obj => db.client.compositeId(obj.botId, obj.id)),
    regex: {
      type: GraphQLString,
      description: 'Regex to trigger this response',
    },
    body: {
      type: GraphQLString,
      description: 'Response body if the regex is matched',
    },
  }),
  interfaces: [nodeInterface],
})

// Our Relay GraphQL Connection Types

const { connectionType: UsersConnection } = connectionDefinitions({
  name: 'User',
  nodeType: GraphQLUser,
})

const { connectionType: BotsConnection } = connectionDefinitions({
  name: 'Bot',
  nodeType: GraphQLBot,
})

const { connectionType: AnswersConnection, edgeType: GraphQLAnswerEdge } = connectionDefinitions({
  name: 'Answer',
  nodeType: GraphQLAnswer,
})

const { connectionType: RegexesConnection, edgeType: GraphQLRegexEdge } = connectionDefinitions({
  name: 'Regex',
  nodeType: GraphQLRegex,
})

const { connectionType: SlackMembersConnection } = connectionDefinitions({
  name: 'SlackMember',
  nodeType: GraphQLSlackMember,
})

const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
    viewer: {
      type: GraphQLUser,
      resolve: (source, args, { rootValue }) => {
        return new Promise(async (resolve, reject) => {
          let user = new db.user.AnonymousUser()

          if (!rootValue) {
            return resolve(user)
          }

          try {
            user = await db.user.getUser(rootValue.uid)
          } catch (err) {
            return reject(err)
          }
          return resolve(user)
        })
      },
    },
  },
})

// Our Relay Mutations

const GraphQLCreateAnswerMutation = mutationWithClientMutationId({
  name: 'CreateAnswer',
  inputFields: {
    title: {
      description: 'Title of the Answer',
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      description: 'Body of the Answer',
      type: new GraphQLNonNull(GraphQLString),
    },
    botId: {
      description: 'ID of the Bot for this Answer',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: ({ teamId, botId }) => db.bot.getBot(teamId, botId),
    },
    answerEdge: {
      type: GraphQLAnswerEdge,
      resolve: ({ answer, botId }) => {
        return new Promise(async (resolve, reject) => {
          // XXX need to have a way to do this that doesn't require fetching
          // all answers
          let answers
          try {
            answers = await db.answer.getAnswers(botId)
          } catch (err) {
            return reject(err)
          }

          // TODO: maybe we make this our own function?
          // cursorForObjectInConnection indexOf was returning -1 even though the
          // item was there, something to do with ===
          let cursor
          for (const index in answers) {
            const a = answers[index]
            if (a.id === answer.id) {
              cursor = offsetToCursor(index)
              break
            }
          }

          return resolve({ cursor, node: answer })
        })
      }
    },
  },
  mutateAndGetPayload: ({ title, body, botId: globalId }, { rootValue: { uid: createdBy } }) => {
    return new Promise(async (resolve, reject) => {
      const { id: compositeId } = fromGlobalId(globalId)
      const [teamId, botId] = db.client.deconstructId(compositeId)

      let answer
      try {
        answer = await db.answer.createAnswer({
          title,
          body,
          botId,
          teamId,
          createdBy,
        })
      } catch (err) {
        return reject(err)
      }

      return resolve({ answer, teamId, botId })
    })
  },
})

const GraphQLDeleteAnswerMutation = mutationWithClientMutationId({
  name: 'DeleteAnswer',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: ({ teamId, botId }) => db.bot.getBot(teamId, botId),
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ globalId }) => globalId,
    },
  },
  mutateAndGetPayload: async ({ id: globalId }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [botId, id] = db.client.deconstructId(compositeId)
    const { teamId } = await db.answer.deleteAnswer(botId, id)
    return {
      botId,
      globalId,
      teamId,
    }
  },
})

const GraphQLUpdateAnswerMutation = mutationWithClientMutationId({
  name: 'UpdateAnswer',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    answer: {
      type: GraphQLAnswer,
      resolve: (answer) => answer,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, title, body }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [botId, id] = db.client.deconstructId(compositeId)

    const answer = await db.answer.updateAnswer({
      body,
      title,
      botId,
      id,
    })
    return answer
  },
})

const GraphQLCreateRegexMutation = mutationWithClientMutationId({
  name: 'CreateRegex',
  inputFields: {
    regex: {
      description: 'Value of the regex',
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      description: 'Body of the response if the regex matches',
      type: new GraphQLNonNull(GraphQLString),
    },
    botId: {
      description: 'ID of the Bot for this Regex',
      type: new GraphQLNonNull(GraphQLString),
    },
    position: {
      description: 'The position of the Regex for the bot',
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: ({ teamId, botId }) => db.bot.getBot(teamId, botId),
    },
    regexEdge: {
      type: GraphQLRegexEdge,
      resolve: ({ regex, botId }) => {
        return new Promise(async (resolve, reject) => {
          // XXX need to have a way to do this that doesn't require fetching
          // all regexes
          let regexes
          try {
            regexes = await db.regex.getRegexes(botId)
          } catch (err) {
            return reject(err)
          }

          let cursor
          for (const index in regexes) {
            const r = regexes[index]
            if (r.id === regex.id) {
              cursor = offsetToCursor(index)
              break
            }
          }

          return resolve({ cursor, node: regex })
        })
      }
    },
  },
  mutateAndGetPayload: ({ regex, body, botId: globalId, position }, { rootValue: { uid: createdBy } }) => {
    return new Promise(async (resolve, reject) => {
      const { id: compositeId } = fromGlobalId(globalId)
      const [teamId, botId] = db.client.deconstructId(compositeId)

      let regex
      try {
        regex = await db.regex.createRegex({
          regex,
          body,
          botId,
          teamId,
          createdBy,
          position,
        })
      } catch (err) {
        return reject(err)
      }

      return resolve({ regex, teamId, botId })
    })
  },
})

const GraphQLDeleteRegexMutation = mutationWithClientMutationId({
  name: 'DeleteRegex',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: ({ teamId, botId }) => db.bot.getBot(teamId, botId),
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ globalId }) => globalId,
    },
  },
  mutateAndGetPayload: async ({ id: globalId }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [botId, id] = db.client.deconstructId(compositeId)
    const { teamId } = await db.regex.deleteRegex(botId, id)
    return {
      botId,
      globalId,
      teamId,
    }
  },
})

// TODO look into bulk updates
const GraphQLUpdateRegexMutation = mutationWithClientMutationId({
  name: 'UpdateRegex',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    regex: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    position: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    regex: {
      type: GraphQLRegex,
      resolve: regex => regex,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, regex, body, position }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [botId, id] = db.client.deconstructId(compositeId)

    const r = await db.regex.updateRegex({
      body,
      regex,
      botId,
      id,
      position,
    })
    return r
  },
})

const GraphQLUpdateBotMutation = mutationWithClientMutationId({
  name: 'UpdateBot',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    purpose: { type: GraphQLString },
    pointsOfContact: { type: new GraphQLList(GraphQLString) },
  },
  outputFields: {
    bot: {
      type: GraphQLBot,
      resolve: (bot) => bot,
    },
  },
  mutateAndGetPayload: async ({ id: globalId, purpose, pointsOfContact }) => {
    const { id: compositeId } = fromGlobalId(globalId)
    const [teamId, id] = db.client.deconstructId(compositeId)

    const bot = await db.bot.updateBot({
      pointsOfContact,
      teamId,
      id,
      purpose: purpose || null,
    })
    return bot
  },
})

const GraphQLLogoutMutation = mutationWithClientMutationId({
  name: 'Logout',
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: (_, { rootValue }) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db.token.deleteToken(rootValue.t.id, rootValue.uid)
      } catch (err) {
        return reject(err)
      }

      const user = new db.user.AnonymousUser()
      // this value is needed to invalidate the relay cache for the currently
      // logged in user
      user.id = rootValue.uid
      return resolve(user)
    })
  },
})

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createAnswer: GraphQLCreateAnswerMutation,
    deleteAnswer: GraphQLDeleteAnswerMutation,
    updateAnswer: GraphQLUpdateAnswerMutation,
    updateBot: GraphQLUpdateBotMutation,
    logout: GraphQLLogoutMutation,
  }),
})

// Our Relay Schema

export default new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation,
})
