import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import GraphQLTopic from '../types/GraphQLTopic'
import GraphQLUser from '../types/GraphQLUser'
import Topics from '../connections/Topics'
import { cursorForInstanceInCollection } from '../utils'

export default mutationWithClientMutationId({
  name: 'CreateTopic',
  inputFields: {
    name: {
      description: 'The name of the Topic',
      type: new GraphQLNonNull(GraphQLString),
    },
    pointsOfContact: {
      type: new GraphQLList(GraphQLString),
      description: 'Points of contact for the Topic. Should be a list of Slack user ids',
    },
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: ({ auth }) => db.user.getUser(auth.uid),
    },
    topic: {
      type: GraphQLTopic,
      resolve: ({ topic }) => topic,
    },
    topicEdge: {
      type: Topics.edgeType,
      resolve: async ({ topic, teamId }) => {
        const topics = await db.topic.getTopics(teamId)
        return cursorForInstanceInCollection(topic, topics)
      },
    },
  },
  mutateAndGetPayload: async ({ name, pointsOfContact }, { auth }) => {
    // TODO clean up
    if (!name) {
      throw new Error('name is required')
    }

    if (name.length >= 30) {
      throw new Error('name must be less than 30 characters')
    }

    const { uid: createdBy, tid: teamId } = auth
    const topic = await db.topic.createTopic({
      name,
      createdBy,
      teamId,
      pointsOfContact,
    })
    tracker.trackCreateTopic({ id: topic.id, auth })
    return { topic, teamId, auth }
  },
})
