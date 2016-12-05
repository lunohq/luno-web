import { db } from 'luno-core'
import { GraphQLEnumType } from 'graphql'

import { registerType } from './registry'

const GraphQLUserRole = new GraphQLEnumType({
  name: 'UserRole',
  values: {
    ADMIN: { value: db.user.ADMIN },
    TRAINER: { value: db.user.TRAINER },
    CONSUMER: { value: db.user.CONSUMER },
  },
})

export default registerType({ type: GraphQLUserRole })
