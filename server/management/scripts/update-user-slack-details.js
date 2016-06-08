/**
 * Script to update the slack details for users.
 *
 * The script will ensure that we have the most current values from slack for
 * the user.
 *
 */

import { db } from 'luno-core'
import { WebClient } from '@slack/client'

import logger from '../../logger'
import { sleep } from './helpers'

export default async function() {
  let updatedUsers = 0
  const teams = await db.team.getTeams()
  for (const team of teams) {
    logger.info(`...updating users within team: ${team.id}`)
    if (!team.slack && !team.slack.bot) {
      logger.error('No bot for team', { team })
      continue
    }

    const client = new WebClient(team.slack.bot.token)

    let response
    try {
      response = await client.users.list()
    } catch (err) {
      logger.error('Error fetching slack members', { err, team })
      continue
    }

    if (!response.ok) {
      logger.error('Failed to fetch slack members', { response, team })
      continue
    }

    const memberLookup = {}
    for (const member of response.members) {
      memberLookup[member.id] = member
    }

    const users = await db.user.getUsers(team.id)
    for (const index in users) {
      const user = users[index]
      const member = memberLookup[user.id]
      if (!member) {
        logger.error('No matching member found', { user, team })
        continue
      }

      const { name, profile } = member
      user.user = name
      user.profile = profile
      logger.info(`...updating user ${user.id} (${index + 1}/${users.length})`)
      try {
        await db.user.updateUser(user)
      } catch (err) {
        logger.error('Error updating user', { err, user })
        continue
      }
      updatedUsers += 1
      // Throttle updates so we don't exceed our provisioned throughput
      await sleep(1)
    }
    logger.info(`...successfully updated ${users.length} users for team: ${team.id}`)
  }
  logger.info(`...successfully updated ${updatedUsers} slack details`)
}
