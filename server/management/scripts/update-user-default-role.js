/**
 * Script to prepare rolling out roles.
 *
 * Any user who has created a team should be an ADMIN, all other users should
 * be TRAINERs.
 *
 */

import { db } from 'luno-core'

import logger from '../../logger'
import { sleep } from './helpers'

export default async function() {
  let updatedUsers = 0
  const teams = await db.team.getTeams()
  for (const team of teams) {
    logger.info(`...updating users within team: ${team.id}`)
    const users = await db.user.getUsers(team.id)
    for (const user of users) {
      if (user.role === undefined) {
        user.role = db.user.TRAINER
        if (team.createdBy === user.id) {
          user.role = db.user.ADMIN
        }
        logger.info(`...updating user ${user.id} to role: ${user.role}`)
        await db.user.updateUser(user)
        updatedUsers += 1
        // Throttle updates so we don't exceed our provisioned throughput
        await sleep(1)
      }
    }
    logger.info(`...successfully updated ${users.length} for team: ${team.id}`)
  }
  logger.info(`...successfully updated ${updatedUsers} users roles`)
}
