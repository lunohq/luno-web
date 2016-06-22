import { WebClient } from '@slack/client'
import { db } from 'luno-core'

export class SlackMember {}

function getClient(teamIdOrTeam) {
  return new Promise(async (resolve, reject) => {
    let team
    if (teamIdOrTeam.slack && teamIdOrTeam.slack.bot && teamIdOrTeam.slack.bot.token) {
      team = teamIdOrTeam
    } else {
      try {
        team = await db.team.getTeam(teamId)
      } catch (err) {
        return reject(err)
      }
    }

    return resolve(new WebClient(team.slack.bot.token))
  })
}

export async function isBotInstalled(team) {
  let installed = false
  if (team.slack && team.slack.bot) {
    const client = getClient(team)
    let response
    try {
      response = await client.auth.test()
    } catch (err) {
      installed = false
      return installed
    }

    if (response && response.ok) {
      installed = true
    }
  }
  return installed
}

export function getMember(teamId, id) {
  return new Promise(async (resolve, reject) => {
    const client = await getClient(teamId)

    let response
    try {
      response = await client.users.info({ user: id })
    } catch (err) {
      return reject(err)
    }

    if (!response.ok) {
      return reject(new Error('Error fetching member'))
    }

    const member = new SlackMember()
    return resolve(Object.assign(member, response.user, { teamId }))
  })
}

export function getMembers(teamId) {
  return new Promise(async (resolve, reject) => {
    const client = await getClient(teamId)

    let response
    try {
      response = await client.users.list({ presence: 0 })
    } catch (err) {
      return reject(err)
    }

    if (!response.ok) {
      return reject(new Error('Error fetching members'))
    }

    const members = []
    for (const user of response.members) {
      if (user.deleted || user.is_bot || user.name === 'slackbot') {
        continue
      }

      const member = new SlackMember()
      Object.assign(member, user, { teamId })
      members.push(member)
    }

    return resolve(members)
  })
}

async function openIM({ client, to }) {
  const res = await client.im.open(to)
  if (!res.ok) {
    throw new Error('Failed to open IM')
  }
  return res.channel.id
}

async function openMPIM({ client, to }) {
  const res = await client.mpim.open(to.join(','))
  if (!res.ok) {
    throw new Error('Failed to open MPIM')
  }
  return res.group.id
}

export async function send({ to, bot, message }) {
  const client = new WebClient(bot.token)
  let channelId
  if (typeof to.join === 'function') {
    if (to.length === 1) {
      channelId = await openIM({ client, to: to[0] })
    } else {
      channelId = await openMPIM({ client, to })
    }
  } else {
    channelId = await openIM({ client, to })
  }
  return client.chat.postMessage(channelId, message, { as_user: true })
}

export default {
  send,
  getMembers,
  getMember,
}
