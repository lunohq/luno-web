import { GraphQLObjectType } from 'graphql'
import { db } from 'luno-core'

import GraphQLUser from './GraphQLUser'
import { registerType, nodeField } from './registry'

const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
    viewer: {
      type: GraphQLUser,
      resolve: async (source, args, { auth }) => {
        let user = new db.user.AnonymousUser()

        if (!auth) {
          return user
        }

        user = await db.user.getUser(auth.uid)
        if (auth.a) {
          user.assumed = true
        }
        return user
      },
    },
  },
})

export default registerType({ type: GraphQLQuery })
