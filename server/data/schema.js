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
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  offsetToCursor,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay';

import { db } from 'luno-core';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Team') {
      return db.team.getTeam(id);
    } else if (type === 'User') {
      return db.user.getUser(id);
    } else if (type === 'Bot') {
      const [partitionKey, sortKey] = db.client.deconstructId(id);
      return db.bot.getBot(partitionKey, sortKey);
    } else if (type === 'Answer') {
      const [partitionKey, sortKey] = db.client.deconstructId(id);
      return db.answer.getAnswer(partitionKey, sortKey);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof db.team.Team) {
      return GraphQLTeam;
    } else if (obj instanceof db.user.User) {
      return GraphQLUser;
    } else if (obj instanceof db.bot.Bot) {
      return GraphQLBot;
    } else if (obj instanceof db.answer.Answer) {
      return GraphQLAnswer;
    }
    return null;
  },
);

// Our GraphQL Types

const GraphQLSlackBot = new GraphQLObjectType({
  name: 'SlackBot',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Our main slack bot id for the Team',
    },
  },
});

const GraphQLSlackInfo = new GraphQLObjectType({
  name: 'SlackInfo',
  description: 'Slack info related to a Team',
  fields: {
    bot: { type: GraphQLSlackBot },
  },
});

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
  }),
  interfaces: [nodeInterface],
});

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
          const bots = await db.bot.getBots(user.teamId);
          return connectionFromArray(bots, args);
        }
        return null;
      },
    },
    anonymous: {
      type: GraphQLBoolean,
      description: 'Boolean indicating whether or not the user is authenticated',
    },
  }),
  interfaces: [nodeInterface],
});

const GraphQLBot = new GraphQLObjectType({
  name: 'Bot',
  description: 'Bot within our system',
  fields: () => ({
    id: globalIdField('Bot', obj => db.client.compositeId(obj.teamId, obj.id)),
    answers: {
      type: AnswersConnection,
      description: 'Answers configured for the Bot',
      args: connectionArgs,
      resolve: async (bot, args) => {
        const answers = await db.answer.getAnswers(bot.id);
        return connectionFromArray(answers, args);
      },
    },
  }),
  interfaces: [nodeInterface],
});

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
});

// Our Relay GraphQL Connection Types

const { connectionType: UsersConnection } = connectionDefinitions({
  name: 'User',
  nodeType: GraphQLUser,
});

const { connectionType: BotsConnection } = connectionDefinitions({
  name: 'Bot',
  nodeType: GraphQLBot,
});

const { connectionType: AnswersConnection, edgeType: GraphQLAnswerEdge } = connectionDefinitions({
  name: 'Answer',
  nodeType: GraphQLAnswer,
});

const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
    viewer: {
      type: GraphQLUser,
      resolve: (source, args, { rootValue }) => {
        return new Promise(async (resolve, reject) => {
          let user = new db.user.AnonymousUser();

          if (!rootValue) {
            return resolve(user);
          }

          try {
            user = await db.user.getUser(rootValue.uid);
          } catch (err) {
            return reject(err);
          }
          return resolve(user);
        });
      },
    },
  },
});

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
          let answers;
          try {
            answers = await db.answer.getAnswers(botId);
          } catch (err) {
            return reject(err);
          }

          // TODO: maybe we make this our own function?
          // cursorForObjectInConnection indexOf was returning -1 even though the
          // item was there, something to do with ===
          let cursor;
          for (const index in answers) {
            const a = answers[index];
            if (a.id === answer.id) {
              cursor = offsetToCursor(index);
              break;
            }
          }

          return resolve({ cursor, node: answer });
        });
      }
    },
  },
  mutateAndGetPayload: ({ title, body, botId: globalId }, { rootValue: { uid: createdBy } }) => {
    return new Promise(async (resolve, reject) => {
      const { id: compositeId } = fromGlobalId(globalId);
      const [teamId, botId] = db.client.deconstructId(compositeId);

      let answer;
      try {
        answer = await db.answer.createAnswer({
          title,
          body,
          botId,
          teamId,
          createdBy,
        });
      } catch (err) {
        return reject(err);
      }

      return resolve({ answer, teamId, botId });
    });
  },
});

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
    const { id: compositeId } = fromGlobalId(globalId);
    const [botId, id] = db.client.deconstructId(compositeId);
    const { teamId } = await db.answer.deleteAnswer(botId, id);
    return {
      botId,
      globalId,
      teamId,
    };
  },
});

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
    const { id: compositeId } = fromGlobalId(globalId);
    const [botId, id] = db.client.deconstructId(compositeId);

    const answer = await db.answer.updateAnswer({
      body,
      title,
      botId,
      id,
    });
    return answer;
  },
});

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
        await db.token.deleteToken(rootValue.t.id, rootValue.uid);
      } catch (err) {
        return reject(err);
      }

      const user = new db.user.AnonymousUser();
      // this value is needed to invalidate the relay cache for the currently
      // logged in user
      user.id = rootValue.uid;
      return resolve(user);
    });
  },
});

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createAnswer: GraphQLCreateAnswerMutation,
    deleteAnswer: GraphQLDeleteAnswerMutation,
    updateAnswer: GraphQLUpdateAnswerMutation,
    logout: GraphQLLogoutMutation,
  }),
});

// Our Relay Schema

export default new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation,
});
