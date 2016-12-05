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
        team = await db.team.getTeam(teamIdOrTeam)
      } catch (err) {
        return reject(err)
      }
    }

    return resolve(new WebClient(team.slack.bot.token))
  })
}

export async function createFileChannel({ team, user }) {
  const { accessToken } = user
  const client = new WebClient(accessToken)

  const { channel: { id: channelId } } = await client.channels.create('luno-file-uploads')
  const message = `DO NOT DELETE! This channel is used by the @luno FAQ bot to
  store files attached to answers. Do not archive this channel or make it
  private. For more info, go to www.lunohq.com or contact @${user.user}.`
  await Promise.all([
    client.channels.invite(channelId, team.slack.bot.userId),
    client.channels.setPurpose(channelId, message),
    client.channels.setTopic(channelId, message),
  ])
  await client.channels.leave(channelId)
  team.files = {
    channelId,
    admin: {
      userId: user.id,
      accessToken: user.accessToken,
      created: new Date().toISOString(),
    },
  }
  return db.team.updateTeam(team)
}

export async function isBotInstalled(team) {
  let installed = false
  if (team.slack && team.slack.bot) {
    const client = await getClient(team)
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

export async function deleteFiles({ teamId, ids }) {
  const client = await getClient(teamId)
  const promises = ids.map(id => client.files.delete(id))
  return Promise.all(promises)
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
  deleteFiles,
}
