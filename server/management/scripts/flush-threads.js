/**
 * Script to clear out threads.
 */
import client from 'luno-core/lib/db/client'
import { db } from 'luno-core'

import logger from '../../logger'

export default async function() {
  let params = {
    TableName: db.thread.threadTable,
  }
  let items = await client.scanAll(params) || []
  let keys = items.map(({ botIdChannelIdUserId, id }) => ({ botIdChannelIdUserId, id }))
  if (keys.length) {
    logger.info(`Flushing ${keys.length} threads`)
    await client.batchDeleteAll({ table: db.thread.threadTable, keys })
    logger.info('Flushed threads')
  }

  params = {
    TableName: db.thread.threadEventTable,
  }
  items = await client.scanAll(params) || []
  keys = items.map(({ threadId, created }) => ({ threadId, created }))
  if (keys.length) {
    logger.info(`Flushing ${keys.length} thread events`)
    await client.batchDeleteAll({ table: db.thread.threadEventTable, keys })
    logger.info('Flushed thread events')
  }
}
