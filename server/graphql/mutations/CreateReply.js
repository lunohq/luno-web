import { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import logger from '../../logger'
import tracker from '../../tracker'

import GraphQLTopic from '../types/GraphQLTopic'
import GraphQLAttachmentInput from '../types/GraphQLAttachmentInput'
import Replies from '../connections/Replies'
import { cursorForInstanceInCollection } from '../utils'
import { formatAttachments } from './utils'

export default mutationWithClientMutationId({
  name: 'CreateReply',
  inputFields: {
    title: {
      description: 'Title of the Reply',
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      description: 'Body of the Reply',
      type: new GraphQLNonNull(GraphQLString),
    },
    keywords: {
      description: 'Comma delimited list of keywords to store with the Reply',
      type: GraphQLString,
    },
    topicId: {
      description: 'ID of the Topic the Reply is assigned to.',
      type: new GraphQLNonNull(GraphQLID),
    },
    attachments: {
      description: 'Reply Attachments',
      type: new GraphQLList(GraphQLAttachmentInput),
    },
  },
  outputFields: {
    topic: {
      type: GraphQLTopic,
      resolve: async ({ teamId, topicId: id }, args, { auth }) => {
        let topic
        try {
          topic = await db.topic.getTopic({ teamId, id })
        } catch (err) {
          logger.error('Error fetching topic', { err, id, auth })
          throw err
        }
        return topic
      },
    },
    replyEdge: {
      type: Replies.edgeType,
      // TODO we can clean this up since we have access to args
      resolve: async ({ reply, topicId, teamId }, args, { auth }) => {
        let replies
        try {
          replies = await db.reply.getRepliesForTopic({ teamId, topicId })
        } catch (err) {
          logger.error('Error fetching replies for topic', { topicId, auth })
          throw err
        }
        return cursorForInstanceInCollection(reply, replies)
      }
    },
  },
  mutateAndGetPayload: async ({ title, body, keywords, attachments, topicId: globalId }, { auth }) => {
    const { uid: createdBy } = auth
    const { id: compositeId } = fromGlobalId(globalId)
    const [teamId, topicId] = db.client.deconstructId(compositeId)
    const params = {
      title,
      body,
      keywords,
      teamId,
      createdBy,
      topicId,
      attachments: formatAttachments(attachments),
    }
    let reply
    try {
      reply = await db.reply.createReply(params)
    } catch (err) {
      logger.error('Error creating reply', { auth, err, params })
      throw err
    }
    tracker.trackCreateAnswer({ auth, id: reply.id })
    return { reply, teamId, topicId }
  },
})
