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
    }
    return null;
  },
  (obj) => {
    if (obj instanceof db.team.Team) {
      return GraphQLTeam;
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
    users: {
      type: UsersConnection,
      description: 'Users within the Team',
      args: {
        teamId: {
          type: GraphQLString,
        },
        ...connectionArgs,
      },
      resolve: (_, { teamId, ...args }) => {
        const users = db.user.getUsers(teamId);
        return connectionFromPromisedArray(users, args);
      },
    },
    bots: {
      type: BotsConnection,
      description: 'Bots within the Team',
      args: {
        teamId: {
          type: GraphQLString,
        },
        ...connectionArgs,
      },
      resolve: (_, { teamId, ...args }) => {
        const bots = db.bot.getBots(teamId);
        return connectionFromPromisedArray(bots, args);
      },
    },
    viewer: {
      type: GraphQLUser,
      description: 'Logged in user',
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve: (_, { id }) => db.user.getUser(id),
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
  }),
  interfaces: [nodeInterface],
});

const GraphQLBot = new GraphQLObjectType({
  name: 'Bot',
  description: 'Bot within our system',
  fields: () => ({
    id: globalIdField('Bot'),
    answers: {
      type: AnswersConnection,
      description: 'Answers configured for the Bot',
      args: {
        teamId: {
          type: GraphQLString,
        },
        botId: {
          type: GraphQLString,
        },
        ...connectionArgs,
      },
      resolve: (_, { teamId, botId, ...args }) => {
        const answers = db.answer.getAnswers(teamId, botId);
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
    id: globalIdField('Answer'),
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

const { connectionType: AnswersConnection } = connectionDefinitions({
  name: 'Answer',
  nodeType: GraphQLAnswer,
});

const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
  },
});

// Our Relay Mutations

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
  }),
});

export default new GraphQLSchema({
  query: GraphQLQuery,
  //mutation: GraphQLMutation,
});
