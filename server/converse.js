import { Server } from 'converse'
import { converse, events } from 'luno-core'

import config from './config/environment'
import logger from './logger'
import tracker from './tracker'
import { createFileChannel } from './actions/slack'

/**
 * Given the way we handle invites, a user can be "new" but have already been
 * created in our db.
 *
 * This allows us to treat users who may be in our system but not authorized
 * with slack yet as new users.
 *
 */
function isNewUser(user) {
  let newUser = !user
  if (user && (!user.scopes || !user.scopes.length)) {
    newUser = true
  }
  return newUser
}

const server = new Server({
  clientId: config.slack.clientId,
  clientSecret: config.slack.clientSecret,
  scopes: {
    login: ['identity.basic', 'identity.email', 'identity.team', 'identity.avatar'],
    install: ['bot', 'commands', 'channels:write'],
  },
  storage: converse.storage,
  isNewUser,
  logger,
})

async function publishCreateUser(user) {
  logger.info('Publishing `create_user` notification')
  tracker.trackCreateUser(user)
  try {
    await events.publish.createUser(user.teamId, user.id)
  } catch (err) {
    logger.error('Error publishing `create_user`', { user, err })
  }
  logger.info('Published `create_user` notification')
}

async function publishCreateBot(team) {
  logger.info('Publishing `create_bot` notification')
  try {
    await events.publish.createBot(team.id)
  } catch (err) {
    logger.error('Error publishing `create_bot`', { team, err })
  }
  logger.info('Published `create_bot` notification')
}

async function publishCreateTeam(team) {
  logger.info('Publishing `create_team` notification')
  try {
    await events.publish.createTeam(team.id)
  } catch (err) {
    logger.error('Error publishing `create_team`', { team, err })
  }
  logger.info('Published `create_team` notification')
}

server.on('authenticated', async ({ user, team, isNew }) => {
  try {
    if (team.slack && team.slack.bot) {
      // We always publish create_bot if available after authentication to handle
      // cases where someone revokes and re-adds luno
      await publishCreateBot(team)

      // If this is a new bot, it means the user has already authenticated, but
      // we had to push them through the install flow. Once the bot is installed,
      // we trigger `create_user`.
      if (isNew.bot) {
        await publishCreateTeam(team)
        await publishCreateUser(user)
      } else if (isNew.user) {
        await publishCreateUser(user)
      }

      // Support new teams and existing teams who need to add this scope
      if (user.scopes.includes('channels:write') && !team.slack.fileChannelId) {
        try {
          await createFileChannel({ team, user })
        } catch (err) {
          logger.error('Error creating file channel', { err, user, team })
        }
      }
    } else if (team.createdBy !== user.id) {
      logger.error('Login Flow Error: bot should exist', { team, user })
    }
  } catch (err) {
    logger.error('Error publishing authentication notifiactions', { user, team, err })
  }
})

export default server
