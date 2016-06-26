import { mutationWithClientMutationId } from 'graphql-relay'
import { db } from 'luno-core'

import GraphQLUser from '../types/GraphQLUser'

export default mutationWithClientMutationId({
  name: 'Logout',
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: async (_, { auth }) => {
    await db.token.deleteToken(auth.t.id, auth.uid)
    if (auth.a) {
      await db.admin.endToken(auth.a.id)
    }
    const user = new db.user.AnonymousUser()
    // this value is needed to invalidate the relay cache for the currently
    // logged in user
    user.id = auth.uid
    return user
  },
})
