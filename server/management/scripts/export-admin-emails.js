/**
 * Script to export admin emails.
 */
import fs from 'fs'
import client from 'luno-core/lib/db/client'
import { db } from 'luno-core'
import stringify from 'csv-stringify'

import logger from '../../logger'

export default async function () {
  const path = 'export-emails.csv'
  const fileStream = fs.createWriteStream(path)
  const stringifier = stringify({
    header: true,
    columns: {
      name: 'Name',
      email: 'Email',
      id: 'User ID',
      role: 'Role',
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
  const teamMap = {}
  teams.forEach(team => {
    teamMap[team.id] = team
  })

  const params = {
    TableName: db.user.table,
    FilterExpression: '#role = :role AND attribute_exists(#profile)',
    ExpressionAttributeNames: {
      '#role': 'role',
      '#profile': 'profile',
    },
    ExpressionAttributeValues: {
      ':role': db.user.ADMIN,
    },
  }

  let inactive = 0
  let skipped = 0
  let users = 0

  async function execute(last) {
    let nextParams = params
    if (last) {
      nextParams = Object.assign({}, params, { ExclusiveStartKey: last })
    }
    logger.info('Fetching admin emails', nextParams)
    const data = await client.scan(nextParams).promise()
    for (const item of data.Items) {
      const team = teamMap[item.teamId]

      if (team.status === 1) {
        skipped += 1
        inactive += 1
        continue
      }

      if (item.email && item.email.endsWith('@lunohq.com')) {
        skipped += 1
        continue
      }

      const output = {
        id: item.id,
        name: item.profile.real_name,
        email: item.email || item.profile && item.profile.email,
        role: item.role,
      }
      users += 1
      stringifier.write(output)
    }

    const { LastEvaluatedKey } = data
    if (LastEvaluatedKey) {
      await execute(LastEvaluatedKey)
    }
  }

  await execute()
  logger.info(`Wrote out emails from ${users}. Skipped: ${skipped}, Inactive: ${inactive}`)
  stringifier.end()
}
