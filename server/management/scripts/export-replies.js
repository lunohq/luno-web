/**
 * Script to export replies for all teams.
 */
import fs from 'fs'
import client from 'luno-core/lib/db/client'
import { db } from 'luno-core'
import stringify from 'csv-stringify'

import logger from '../../logger'
import { sleep } from './helpers'

export default async function() {
  const path = 'export-replies.csv'
  const fileStream = fs.createWriteStream(path)
  const stringifier = stringify({
    header: true,
    columns: {
      name: 'Team Name',
      teamId: 'Team ID',
      email: 'Creator\'s Email',
      title: 'Reply Title',
      body: 'Reply Body',
    },
  })

  stringifier.on('readable', () => {
    let row
    while(row = stringifier.read()) {
      fileStream.write(row)
    }
  })
  stringifier.on('finish', () => {
    fileStream.end()
    logger.info(`Finished writing replies to: ${path}`)
  })

  const teams = await db.team.getTeams()
  const createdByIds = teams.map(team => ({ id: team.createdBy }))
  const creators = await client.batchGetAll({ table: db.user.table, items: createdByIds })
  const creatorMap = {}
  creators.forEach(creator => {
    creatorMap[creator.id] = creator
  })
  for (const team of teams) {
    logger.info(`writing replies for team: ${team.id}`)
    const creator = creatorMap[team.createdBy]
    const replies = await db.reply.getReplies(team.id)
    replies.forEach(reply => {
      const output = {
        name: team.name,
        teamId: team.id,
        email: creator.email,
        title: reply.title,
        body: reply.body,
      }
      stringifier.write(output)
    })
    await sleep(1)
  }
  stringifier.end()
}
