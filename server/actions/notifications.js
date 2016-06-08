import config from '../config/environment'
import { send } from './slack'

export function sendInvite({ team, sourceUserId, userId }) {
  const botUserId = team.slack.bot.userId
  const message = `Congrats! <@${sourceUserId}> has invited you to help train <@${botUserId}> - a helpdesk bot for Slack teams. Stop getting bugged with common questions. Let <@${botUserId}> handle them for you. Sign in at ${config.dashboardUrl}.`
  return send({ to: userId, bot: team.slack.bot, message })
}

export function sendAdminPromotion({ team, sourceUserId, userId }) {
  const message = `<@${sourceUserId}> promoted you to a Superadmin on Luno. Sign in at ${config.dashboardUrl}.`
  return send({ to: userId, bot: team.slack.bot, message })
}

export default {
  sendInvite,
}
