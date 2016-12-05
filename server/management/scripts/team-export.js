/**
 * Script to export admin emails.
 */
import fs from 'fs'
import { db } from 'luno-core'
import stringify from 'csv-stringify'

import logger from '../../logger'

export default async function (teamId) {
  logger.info(`Exporting team: ${teamId}`)
  const path = `team-export-${teamId}.csv`
  const fileStream = fs.createWriteStream(path)
  const stringifier = stringify({
    header: true,
    columns: {
      topic: 'Topic',
      title: 'Title',
      body: 'Body',
      keywords: 'Keywords',
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
    logger.info(`Finished writing replies to: ${path}`)
  })

  const topics = await db.topic.getTopics(teamId)
  const topicMap = {}
  const itemToTopic = {}
  topics.forEach(async topic => {
    topicMap[topic.id] = topic
    const items = await db.topicItem.getItemsForTopic({ teamId, topicId: topic.id })
    items.forEach(item => {
      itemToTopic[item.itemId] = topic
    })
  })

  const replies = await db.reply.getReplies(teamId)
  replies.forEach(reply => {
    const topic = itemToTopic[reply.id] || {}
    const output = {
      topic: topic.displayName || 'Default',
      title: reply.title,
      body: reply.body,
      keywords: reply.keywords,
    }
    stringifier.write(output)
  })

  logger.info(`Exported replies for ${teamId}`)
  stringifier.end()
}
