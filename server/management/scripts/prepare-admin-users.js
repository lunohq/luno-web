/**
 * Script to prepare rolling out roles.
 *
 * Any current user should be treated as an ADMIN in the new role system.
 *
 */

import { db } from 'luno-core'

import logger from '../../logger'

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds * 1000)
  })
}

export default async function() {
  const users = await db.user.scan()
  let updatedUsers = 0
  for (const user of users) {
    if (user.role === undefined) {
      logger.info(`...updating user ${user.id} to role: ${db.user.ADMIN}`)
      await db.user.updateUserRole({ id: user.id, role: db.user.ADMIN })
      updatedUsers += 1
      // Throttle updates so we don't exceed our provisioned throughput
      await sleep(1)
    }
  }
  logger.info(`...successfully updated ${updatedUsers} users to admin`)
}
