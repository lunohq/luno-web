/**
 * Script to copy answers to replies.
 *
 */
import client from 'luno-core/lib/db/client'
import { db } from 'luno-core'

import logger from '../../logger'
import { sleep } from './helpers'

/**
 * Return a Put Request that can be sent with bulkWrite.
 *
 * Should conditionally check that the reply doesn't already exist.
 *
 * @param answer answer to copy to reply
 * @returns PutRequestItem
 *
 */
function generateCopyReplyRequest({ answer, topic }) {
  const reply = {
    id: answer.id,
    title: answer.title,
    body: answer.body,
    created: answer.created,
    changed: answer.changed,
    topicId: topic.id,
    teamId: answer.teamId,
    createdBy: answer.createdBy,
  }
  if (answer.updatedBy) {
    reply.updatedBy = answer.updatedBy
  }
  return { PutRequest: { Item: reply } }
}

function generateTopicItemRequest({ answer, topic }) {
  const topicItem = {
    teamId: answer.teamId,
    topicId: topic.id,
    itemId: answer.id,
    createdBy: answer.createdBy,
    teamIdTopicId: db.client.compositeId(answer.teamId, topic.id),
    created: answer.created,
  }
  return { PutRequest: { Item: topicItem } }
}

async function processBatch({ team, answers, topic }) {
  let params = {
    RequestItems: {
      [db.reply.table]: answers.map(answer => generateCopyReplyRequest({ answer, topic })),
    },
  }
  let result = await client.batchWrite(params).promise()
  logger.info('Reply batchWrite Result', { result })

  params = {
    RequestItems: {
      [db.topicItem.table]: answers.map(answer => generateTopicItemRequest({ answer, topic })),
    },
  }
  result = await client.batchWrite(params).promise()
  logger.info('TopicItem batchWrite Result', { result })
}

/**
 * Copy answers for the given team to replies.
 */
async function copyAnswersToReplies({ team }) {
  const bots = await db.bot.getBots(team.id)
  const bot = bots[0]
  const topic = await db.topic.getDefaultTopic(team.id)
  const answers = await db.answer.getAnswers(bot.id)
  const batchSize = 25
  const numBatches = Math.floor(answers.length / batchSize) + (answers.length % batchSize ? 1 : 0)
  logger.info('Copying answers to replies for team', {
    team,
    numBatches,
    totalAnswers: answers.length,
    botId: bot.id,
  })
  for (let i = 1; i <= numBatches; i++) {
    const batch = answers.slice((i - 1) * batchSize, i * batchSize)
    if (batch.length) {
      logger.info(`Processing batch: ${i}/${numBatches}`)
      await processBatch({ team, answers: batch, topic })
    }
  }
}

export default async function() {
  const teams = await db.team.getTeams()
  for (const team of teams) {
    try {
      await copyAnswersToReplies({ team })
    } catch (err) {
      logger.error('Error copying answers for team', { team, err })
      continue
    }
    await sleep(1)
  }
}
