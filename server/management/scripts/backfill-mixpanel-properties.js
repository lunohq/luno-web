/**
 * Script to backfill "email" and "role" within mixpanel.
 *
 */
import Mixpanel from 'mixpanel'
import { db } from 'luno-core'

import schema from '../../data/schema'
import logger from '../../logger'
import config from '../../config/environment/index'
import { sleep } from './helpers'

const UserRole = schema.getType('UserRole')

export default async function() {
  const mixpanel = Mixpanel.init(config.mixpanel.token)
  const teams = await db.team.getTeams()
  for (const team of teams) {
    logger.info(`...updating users within team: ${team.id}`)
    const users = await db.user.getUsers(team.id)
    for (const index in users) {
      const user = users[index]
      const distinctId = `${team.id}:${user.id}`
      const props = {
        Role: UserRole.serialize(user.role),
      }
      if (user.email) {
        props.$email = user.email
      } else if (user.profile && user.profile.email) {
        props.$email = user.profile.email
        logger.info('! email not found for user', { user })
      } else {
        logger.info('!! no email found for user', { user })
      }
      logger.info(`...updating user props: ${distinctId}`, { props })
      mixpanel.people.set(distinctId, props)
    }
    await sleep(1)
  }
}
