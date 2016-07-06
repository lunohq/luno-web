/**
 * Script to export queries sent to luno.
 */
import fs from 'fs'
import client from 'luno-core/lib/db/client'
import { db } from 'luno-core'
import stringify from 'csv-stringify'

import logger from '../../logger'
import { sleep } from './helpers'

export default async function () {
  const path = 'export-queries.csv'
  const fileStream = fs.createWriteStream(path)
  const stringifier = stringify({
    header: true,
    columns: {
      name: 'Team Name',
      teamId: 'Team ID',
      email: 'Creator\'s Email',
      query: 'Query',
      user: 'User ID',
    },
  })

  stringifier.on('readable', () => {
    let row
    /* eslint-disable no-cond-assign */
    while (row = stringifier.read()) {
      fileStream.write(row)
    }
    /* elsint-enable no-cond-assign */
  })
  stringifier.on('finish', () => {
    fileStream.end()
    logger.info(`Finished writing queries to: ${path}`)
  })

  const teams = await db.team.getTeams()
  const createdByIds = teams.map(team => ({ id: team.createdBy }))
  const creators = await client.batchGetAll({ table: db.user.table, items: createdByIds })
  const creatorMap = {}
  creators.forEach(creator => {
    creatorMap[creator.id] = creator
  })
  const botMap = {}
  teams.forEach(team => {
    const botUserId = team.slack && team.slack.bot && team.slack.bot.userId
    botMap[botUserId] = team
  })

  const params = {
    TableName: db.thread.threadEventTable,
    FilterExpression: '#type = :type',
    ExpressionAttributeNames: {
      '#type': 'type',
    },
    ExpressionAttributeValues: {
      ':type': db.thread.EVENT_ANSWER_FLOW,
    },
  }

  let count = 0

  async function execute(last) {
    count += 1
    let nextParams = params
    if (last) {
      nextParams = Object.assign({}, params, { ExclusiveStartKey: last })
    }
    logger.info('Fetching thread events', nextParams)
    const data = await client.scan(nextParams).promise()
    for (const item of data.Items) {
      const team = botMap[item.botId]
      if (team && item.meta && item.meta.query) {
        const creator = creatorMap[team.createdBy]
        // Allow Front Row
        if (!creator.email || (team.id !== 'T03CTC00T' && creator.email.endsWith('@lunohq.com'))) {
          continue
        }
        const output = {
          name: team.name,
          teamId: team.id,
          email: creator.email,
          query: item.meta && item.meta.query,
          user: item.userId,
        }
        stringifier.write(output)
      }
    }
    const { LastEvaluatedKey } = data
    if (LastEvaluatedKey) {
      if (count % 20 === 0) {
        logger.info('sleeping...')
        await sleep(10)
      }
      await execute(LastEvaluatedKey)
    }
  }

  await execute()
  stringifier.end()
}
