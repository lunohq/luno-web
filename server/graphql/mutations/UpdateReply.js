import { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql'
import { toGlobalId, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import tracker from '../../tracker'

import GraphQLReply from '../types/GraphQLReply'
import GraphQLTopic from '../types/GraphQLTopic'
import GraphQLAttachmentInput from '../types/GraphQLAttachmentInput'
import Replies from '../connections/Replies'
import { cursorForInstanceInCollection } from '../utils'

export default mutationWithClientMutationId({
  name: 'UpdateReply',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    keywords: { type: GraphQLString },
    attachments: { type: new GraphQLList(GraphQLAttachmentInput) },
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
      resolve: async ({ reply, topicId, teamId }) => {
        const replies = await db.reply.getRepliesForTopic({ teamId, topicId })
        return cursorForInstanceInCollection(reply, replies)
      },
    },
    previousTopic: {
      type: GraphQLTopic,
      resolve: ({ previousTopicId, teamId }) => db.topic.getTopic({ teamId, id: previousTopicId }),
    },
    topic: {
      type: GraphQLTopic,
      resolve: ({ topicId, teamId }) => db.topic.getTopic({ teamId, id: topicId }),
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
  }, { auth }) => {
    const { uid: updatedBy } = auth
    const { id: compositeId } = fromGlobalId(globalId)
    const { id: compositeTopicId } = fromGlobalId(globalTopicId)
    const { id: compositePreviousTopicId } = fromGlobalId(globalPreviousTopicId)
    const [teamId, id] = db.client.deconstructId(compositeId)
    const topicId = db.client.deconstructId(compositeTopicId)[1]
    const previousTopicId = db.client.deconstructId(compositePreviousTopicId)[1]
    const reply = await db.reply.updateReply({
      id,
      body,
      title,
      keywords,
      updatedBy,
      topicId,
      teamId,
      attachments,
    })
    tracker.trackUpdateAnswer({ auth, id })
    return { reply, teamId, topicId, previousTopicId }
  },
})
