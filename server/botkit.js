/* eslint-disable no-console, no-shadow */
import Botkit from 'botkit'
import { botkit as bk, events, db } from 'luno-core'

import config from './config/environment'
import logger from './logger'
import tracker from './tracker'
import { handleSlashCommand } from './handlers'

const botkit = Botkit.slackbot({
  storage: bk.storage,
  logger,
}).configureSlackApp({
  clientId: config.slack.clientId,
  clientSecret: config.slack.clientSecret,
  scopes: ['bot', 'commands'],
})

// Customize findTeamById to include our internal bot id
botkit.findTeamById = async (id, cb) => {
  let bots
  try {
    bots = await db.bot.getBots(id)
  } catch (err) {
    return cb(err)
  }
  botkit.storage.teams.get(id, (err, team) => {
    let fullTeam
    if (team && bots.length) {
      const slackTeam = db.team.toSlackTeam(team, bots[0])
      fullTeam = Object.assign({}, slackTeam, team)
    }
    cb(err, fullTeam)
  })
  return null
}

botkit.on('create_bot', async (bot) => {
  logger.info('Publishing `create_bot` notification')
  try {
    await events.publish.createBot(bot.config.id)
  } catch (err) {
    logger.error('Error publishing `create_bot`', { teamId: bot.config.id }, err)
  }
  logger.info('Published `create_bot` notification')
})

botkit.on('create_team', async (bot) => {
  logger.info('Publishing `create_team` notification')
  try {
    await events.publish.createTeam(bot.config.id)
  } catch (err) {
    logger.error('Error publishing `create_team`', { teamId: bot.config.id }, err)
  }
  logger.info('Published `create_team` notification')
})

botkit.on('create_user', async (bot, user) => {
  logger.info('Publishing `create_user` notification')
  tracker.trackCreateUser(user)
  try {
    await events.publish.createUser(user.teamId, user.id)
  } catch (err) {
    logger.error('Error publishing `create_user`', { user }, err)
  }
  logger.info('Published `create_user` notification')
})

botkit.on('slash_command', (bot, message) => {
  if (message.token !== config.slack.slashCommandToken) {
    logger.error('Invalid token received for slash command', { message })
    return
  }

  handleSlashCommand(bot, message)
})

export default botkit
