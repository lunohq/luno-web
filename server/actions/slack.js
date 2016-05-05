import { WebClient } from '@slack/client'
import { db } from 'luno-core'

export class SlackMember {}

function getClient(teamId) {
  return new Promise(async (resolve, reject) => {
    let team
    try {
      team = await db.team.getTeam(teamId)
    } catch (err) {
      return reject(err)
    }

    return resolve(new WebClient(team.slack.bot.token))
  })
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
      const member = new SlackMember()
      Object.assign(member, user, { teamId })
      members.push(member)
    }

    return resolve(members)
  })
}
