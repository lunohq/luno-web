/**
 * Script to add default topic for every team.
 *
 */
import { db } from 'luno-core'

import logger from '../../logger'
import { sleep } from './helpers'

export default async function() {
  const teams = await db.team.getTeams()
  for (const team of teams) {
    const topic = await db.topic.getDefaultTopic(team.id)
    if (topic === undefined) {
      logger.info(`Creating topic for team: ${team.id}`)
      await db.topic.createTopic({ teamId: team.id, isDefault: 1 })
    } else {
      logger.info(`Topic already exists for team: ${team.id}`, { topic })
    }
    await sleep(1)
  }
}
