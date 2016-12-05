import { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql'
import { toGlobalId, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'
import logger from '../../logger'

import { deleteFiles } from '../../actions/file'

import GraphQLReply from '../types/GraphQLReply'
import GraphQLTopic from '../types/GraphQLTopic'
import GraphQLAttachmentInput from '../types/GraphQLAttachmentInput'
import Replies from '../connections/Replies'
import { cursorForInstanceInCollection } from '../utils'
import { formatAttachments } from './utils'

export default mutationWithClientMutationId({
  name: 'UpdateReply',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    keywords: { type: GraphQLString },
    attachments: { type: new GraphQLList(GraphQLAttachmentInput) },
    deleteFileIds: { type: new GraphQLList(GraphQLID) },
    topicId: { type: new GraphQLNonNull(GraphQLID) },
    previousTopicId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    reply: {
      type: GraphQLReply,
      resolve: ({ reply }) => reply,
    },
    replyId: {
      type: GraphQLID,
      resolve: ({ reply }) => toGlobalId('Reply', reply.id),
    },
    replyEdge: {
      type: Replies.edgeType,
      resolve: async ({ reply, topicId, teamId }, args, { auth }) => {
        let replies
        try {
          replies = await db.reply.getRepliesForTopic({ teamId, topicId })
        } catch (err) {
          logger.error('Error fetching replies for topic', { topicId, auth, err })
          throw err
        }
        return cursorForInstanceInCollection(reply, replies)
      },
    },
    previousTopic: {
      type: GraphQLTopic,
      resolve: async ({ previousTopicId, teamId }, args, { auth }) => {
        let topic
        try {
          topic = await db.topic.getTopic({ teamId, id: previousTopicId })
        } catch (err) {
          logger.error('Error fetching topic', { previousTopicId, auth, err })
          throw err
        }
        return topic
      },
    },
    topic: {
      type: GraphQLTopic,
      resolve: async ({ topicId, teamId }, args, { auth }) => {
        let topic
        try {
          topic = await db.topic.getTopic({ teamId, id: topicId })
        } catch (err) {
          logger.error('Error fetching topic', { topicId, auth, err })
          throw err
        }
        return topic
      },
    },
  },
  mutateAndGetPayload: async ({
    id: globalId,
    title,
    body,
    keywords,
    attachments,
    topicId: globalTopicId,
    previousTopicId: globalPreviousTopicId,
    deleteFileIds,
  }, { auth }) => {
    const { uid: updatedBy } = auth
    const { id: compositeId } = fromGlobalId(globalId)
    const { id: compositeTopicId } = fromGlobalId(globalTopicId)
    const { id: compositePreviousTopicId } = fromGlobalId(globalPreviousTopicId)
    const [teamId, id] = db.client.deconstructId(compositeId)
    const topicId = db.client.deconstructId(compositeTopicId)[1]
    const previousTopicId = db.client.deconstructId(compositePreviousTopicId)[1]
    if (deleteFileIds) {
      const fileIds = deleteFileIds.map(globalId => fromGlobalId(globalId).id)
      try {
        await deleteFiles({ teamId, fileIds })
      } catch (err) {
        logger.error('Error deleting files', { fileIds, err, auth })
      }
    }
    const params = {
      id,
      body,
      title,
      keywords,
      updatedBy,
      topicId,
      teamId,
      attachments: formatAttachments(attachments),
    }
    let reply
    try {
      reply = await db.reply.updateReply(params)
    } catch (err) {
      logger.error('Error updating reply', { params, auth, err })
      throw err
    }
    tracker.trackUpdateAnswer({ auth, id })
    return { reply, teamId, topicId, previousTopicId }
  },
})
