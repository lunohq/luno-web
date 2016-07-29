import { GraphQLObjectType } from 'graphql'
import { db } from 'luno-core'

import CreateReply from '../mutations/CreateReply'
import DeleteReply from '../mutations/DeleteReply'
import UpdateReply from '../mutations/UpdateReply'
import Logout from '../mutations/Logout'
import UpdateBotPurpose from '../mutations/UpdateBotPurpose'
import UpdateBotPointsOfContact from '../mutations/UpdateBotPointsOfContact'
import UpdateUser from '../mutations/UpdateUser'
import InviteUser from '../mutations/InviteUser'
import CreateTopic from '../mutations/CreateTopic'
import UpdateTopic from '../mutations/UpdateTopic'
import DeleteTopic from '../mutations/DeleteTopic'
import UploadFile from '../mutations/UploadFile'

import { registerType } from './registry'

function adminMutation({ resolve, ...other }) {
  return {
    resolve: async (source, args, context, info) => {
      // TODO this should be cached
      const user = await db.user.getUser(context.auth.uid)
      if (!user.isAdmin) {
        throw new Error('Permission Denied')
      }
      return resolve(source, args, context, info)
    },
    ...other,
  }
}

function staffMutation({ resolve, ...other }) {
  return {
    resolve: async (source, args, context, info) => {
      // TODO this should be cached
      const user = await db.user.getUser(context.auth.uid)
      if (!user.isStaff) {
        throw new Error('Permission Denied')
      }
      return resolve(source, args, context, info)
    },
    ...other,
  }
}

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    logout: Logout,
    updateBotPurpose: adminMutation(UpdateBotPurpose),
    updateBotPointsOfContact: adminMutation(UpdateBotPointsOfContact),
    updateUser: adminMutation(UpdateUser),
    inviteUser: adminMutation(InviteUser),
    createReply: staffMutation(CreateReply),
    deleteReply: staffMutation(DeleteReply),
    updateReply: staffMutation(UpdateReply),
    createTopic: staffMutation(CreateTopic),
    deleteTopic: staffMutation(DeleteTopic),
    updateTopic: staffMutation(UpdateTopic),
    uploadFile: staffMutation(UploadFile),
  }),
})

export default registerType({ type: GraphQLMutation })
