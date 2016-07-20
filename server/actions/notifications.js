import { db } from 'luno-core'

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

async function getAdminUserIds(teamId) {
  const admins = await db.user.getAdmins(teamId)
  return admins.map(({ id }) => id)
}

export async function sendReactivatedNotification({ team, userId }) {
  const adminUserIds = await getAdminUserIds(team.id)
  const message = `Hey Luno admins, just an fyi, <@${userId}> reinstalled me and has been set as an admin.`
  return send({ to: adminUserIds, bot: team.slack.bot, message })
}

export async function sendNewTrainerNotification({ team, userId }) {
  const adminUserIds = await getAdminUserIds(team.id)
  const message = `Hey Luno admins, just an fyi, <@${userId}> just signed up to help train me.`
  return send({ to: adminUserIds, bot: team.slack.bot, message })
}

export async function sendAccessRequest({ team, userId }) {
  const admins = await db.user.getAdmins(team.id)
  const adminUserIds = []
  let formattedAdmins = []
  for (const user of admins) {
    adminUserIds.push(user.id)
    formattedAdmins.push(`<@${user.id}>`)
  }
  formattedAdmins = formattedAdmins.join(', ')
  const userMessage = `Hey <@${userId}>, thanks for your interest in Luno. I've let the admins (${formattedAdmins}) know, but feel free to bug them directly.`
  const adminMessage = `Hey Luno admins, <@${userId}> wants to help train me. Can you give them access? You can do that at ${config.dashboardUrl}/admin/users.`
  return Promise.all([
    send({ to: userId, bot: team.slack.bot, message: userMessage }),
    send({ to: adminUserIds, bot: team.slack.bot, message: adminMessage }),
  ])
}

export default {
  sendInvite,
  sendAdminPromotion,
  sendAccessRequest,
  sendNewTrainerNotification,
}
