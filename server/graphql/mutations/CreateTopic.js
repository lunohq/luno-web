import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import logger from '../../logger'
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
      resolve: async (payload, args, { auth }) => {
        let user
        try {
          user = await db.user.getUser(auth.uid)
        } catch (err) {
          logger.error('Error fetching user', { auth, err })
          throw err
        }
        return user
      },
    },
    topic: {
      type: GraphQLTopic,
      resolve: ({ topic }) => topic,
    },
    topicEdge: {
      type: Topics.edgeType,
      resolve: async ({ topic, teamId }, args, { auth }) => {
        let topics
        try {
          topics = await db.topic.getTopics(teamId)
        } catch (err) {
          logger.error('Error fetching topics', { auth, err })
          throw err
        }
        return cursorForInstanceInCollection(topic, topics)
      },
    },
  },
  mutateAndGetPayload: async ({ name, pointsOfContact }, { auth }) => {
    // TODO clean up
    if (!name) {
      throw new Error('name is required')
    }

    if (name.length > 30) {
      throw new Error('name must be less than 30 characters')
    }

    const { uid: createdBy, tid: teamId } = auth
    const params = {
      name,
      createdBy,
      teamId,
      pointsOfContact,
    }
    let topic
    try {
      topic = await db.topic.createTopic(params)
    } catch (err) {
      logger.error('Error creating topic', { params, auth, err })
      throw err
    }
    tracker.trackCreateTopic({ id: topic.id, auth })
    return { topic, teamId }
  },
})
