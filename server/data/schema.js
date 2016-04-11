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
  connectionFromPromisedArray,
  offsetToCursor,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay';

import { db } from 'luno-core';

function getViewer() {
  // TODO this should do something with the token
  return db.user.getUser('1', '2');
}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Team') {
      return db.team.getTeam(id);
    } else if (type === 'User') {
      const [partitionKey, sortKey] = id.split(':');
      return db.user.getUser(partitionKey, sortKey);
    } else if (type === 'Bot') {
      const [partitionKey, sortKey] = id.split(':');
      return db.bot.getBot(partitionKey, sortKey);
    } else if (type === 'Answer') {
      const [partitionKey, sortKey] = id.split(':');
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
    domain: {
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
    id: globalIdField('User', (obj) => `${obj.teamId}:${obj.id}`),
    fullName: {
      type: GraphQLString,
      description: 'The full name of the User',
    },
    team: {
      type: GraphQLTeam,
      description: 'The Team the User belongs to',
      resolve: (user) => db.team.getTeam(user.teamId),
    },
    bots: {
      type: BotsConnection,
      description: 'Bots the User has access to',
      args: connectionArgs,
      resolve: (user, args) => {
        const bots = db.bot.getBots(user.teamId);
        return connectionFromPromisedArray(bots, args);
      },
    },
  }),
  interfaces: [nodeInterface],
});

const GraphQLBot = new GraphQLObjectType({
  name: 'Bot',
  description: 'Bot within our system',
  fields: () => ({
    id: globalIdField('Bot', (obj) => `${obj.teamId}:${obj.id}`),
    answers: {
      type: AnswersConnection,
      description: 'Answers configured for the Bot',
      args: connectionArgs,
      resolve: (bot, args) => {
        const answers = db.answer.getAnswers(bot.teamId, bot.id);
        return connectionFromPromisedArray(answers, args);
      },
    },
  }),
  interfaces: [nodeInterface],
});

const GraphQLAnswer = new GraphQLObjectType({
  name: 'Answer',
  description: 'An answer that is tied to a Bot',
  fields: () => ({
    id: globalIdField('Answer', (obj) => `${obj.teamIdBotId}:${obj.id}`),
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
      resolve: getViewer,
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
      // TODO: should this be returning a promise that can be rjected?
      resolve: async ({ answer: { id }, teamId, botId, botGlobalId }) => {
        const answer = await db.answer.getAnswer(`${teamId}_${botId}`, id);
        const answers = await db.answer.getAnswers(teamId, botId);

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

        return {
          cursor,
          node: answer,
        };
      }
    },
  },
  mutateAndGetPayload: async ({ title, body, botId: id }) => {
    const [teamId, botId] = fromGlobalId(id).id.split(':');
    let answer;
    try {
      answer = await db.answer.createAnswer({
        title,
        body,
        teamId,
        botId,
      });
    } catch (err) {
      return err;
    }
    return {
      answer,
      botId,
      teamId,
      botGlobalId: id,
    };
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
      resolve: ({ id }) => id,
    },
  },
  mutateAndGetPayload: async ({ id }) => {
    const { id: answerId } = fromGlobalId(id);
    const [partitionKey, sortKey] = answerId.split(':');
    const [teamId, botId] = partitionKey.split('_');
    await db.answer.deleteAnswer(partitionKey, sortKey);
    return {
      botId,
      id,
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
  mutateAndGetPayload: async ({ id, title, body }) => {
    const { id: answerId } = fromGlobalId(id);
    const [partitionKey, sortKey] = answerId.split(':');
    const answer = await db.answer.updateAnswer({
      body,
      title,
      teamIdBotId: partitionKey,
      id: sortKey,
    });
    return answer;
  },
});

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createAnswer: GraphQLCreateAnswerMutation,
    deleteAnswer: GraphQLDeleteAnswerMutation,
    updateAnswer: GraphQLUpdateAnswerMutation,
  }),
});

// Our Relay Schema

export default new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation,
});
