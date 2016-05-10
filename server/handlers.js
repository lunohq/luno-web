import { es } from 'luno-core'

import logger, { metadata } from './logger'
import { uploadResult } from './actions/bot'

export function handleSlashCommand(bot, message) {
  let command
  let text
  const parts = message.text.split(' ')
  if (parts) {
    command = parts[0]
    text = parts.slice(1).join(' ').trim()
  }

  if (command.startsWith('explain')) {
    const verbose = command.includes('[v]')
    const match = command.match(/\[id:([^\]]+)\]/)
    if (match) {
      return handleExplainId({ bot, message, text, id: match[1] })
    } else {
      return handleExplain({ bot, message, text, verbose })
    }
  } else if (command.startsWith('validate')) {
    return handleValidate({ bot, message, text })
  } else {
    return handleDefault({ bot, message })
  }
}

function formatResult({ _source: source, _score: score }) {
  return `*title:* ${source.title}, *score*: ${score}`
}

function explainResults({ bot, message, query, result, verbose }) {
  return new Promise(async (resolve) => {
    const parts = [`Found the following results for: *${query}*`]
    const formattedResults = result.hits.hits.map(hit => formatResult(hit))
    parts.push(...formattedResults)
    bot.replyPrivate(message, parts.join('\n'))

    if (verbose) {
      let upload
      try {
        upload = await uploadResult({ bot, message, query, result })
      } catch (err) {
        logger.error('Error uploading result', metadata({ bot, message, err, query, result }))
        return reject()
      }

      bot.replyPrivateDelayed(message, `Full explanation: ${upload.permalink}`, (err) => {
        if (err) {
          logger.error('Error sending delayed message', metadata({ err, message }))
        }
      })
    }
    return resolve()
  })
}

export async function handleExplain({ bot, message, text, verbose }) {
  let result
  try {
    result = await es.answer.search(bot.config.luno.botId, text)
  } catch (err) {
    logger.error('Error executing search', metadata({ err, bot, message }))
  }
  try {
    await explainResults({ bot, message, query: text, result, verbose })
  } catch (err) {
    logger.error('Error explaining results', metadata({ err, bot, message, result }))
  }
}

export async function handleExplainId({ bot, message, text, id }) {
  let answerId
  try {
    answerId = new Buffer(id, 'base64').toString('ascii').split('_')[1]
  } catch (err) {
    logger.error('Error parsing id', metadata({ err, bot, message, id }))
    return reject(err)
  }

  let result
  try {
    result = await es.answer.explain(bot.config.luno.botId, text, answerId)
  } catch (err) {
    logger.error('Error executing explain', metadata({ err, bot, message }))
    return reject(err)
  }

  let upload
  try {
    upload = await uploadResult({ bot, message, query: text, result })
  } catch (err) {
    logger.error('Error uploading result', metadata({ err, bot, message, result }))
    return reject(err)
  }

  bot.replyPrivate(message, `Full explanation: ${upload.permalink}`, (err) => {
    if (err) {
      logger.error('Error sending delayed message', metadata({ err, message }))
    }
  })
}

export async function handleValidate({ bot, message, text }) {
  let result
  try {
    result = await es.answer.validate(bot.config.luno.botId, text)
  } catch (err) {
    logger.error('Error executing validate', metadata({ err, bot, message }))
  }

  bot.replyPrivate(message, `Results of validating query:\n\`\`\`${JSON.stringify(result, undefined, '  ')}\`\`\``)
}

export function handleDefault({ bot, message }) {
  bot.replyPrivate(message, ':wave:')
}
