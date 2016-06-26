import { GraphQLObjectType } from 'graphql'
import { db } from 'luno-core'

import CreateAnswer from '../mutations/CreateAnswer'
import DeleteAnswer from '../mutations/DeleteAnswer'
import UpdateAnswer from '../mutations/UpdateAnswer'
import Logout from '../mutations/Logout'
import UpdateBotPurpose from '../mutations/UpdateBotPurpose'
import UpdateBotPointsOfContact from '../mutations/UpdateBotPointsOfContact'
import UpdateUser from '../mutations/UpdateUser'
import InviteUser from '../mutations/InviteUser'

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
    createAnswer: staffMutation(CreateAnswer),
    deleteAnswer: staffMutation(DeleteAnswer),
    updateAnswer: staffMutation(UpdateAnswer),
    logout: Logout,
    updateBotPurpose: adminMutation(UpdateBotPurpose),
    updateBotPointsOfContact: adminMutation(UpdateBotPointsOfContact),
    updateUser: adminMutation(UpdateUser),
    inviteUser: adminMutation(InviteUser),
  }),
})

export default registerType({ type: GraphQLMutation })
