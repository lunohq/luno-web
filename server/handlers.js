import { es } from 'luno-core'

import logger, { metadata } from './logger'
import { uploadResult } from './actions/bot'

function formatResult({ _source: source, _score: score }) {
  return `*title:* ${source.title}, *score*: ${score}`
}

function explainResults({ bot, message, query, result, verbose }) {
  return new Promise(async (resolve, reject) => {
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
    result = await es.answer.search(bot.config.luno.botId, text, { explain: true, timeout: 5000 })
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
    return
  }

  let result
  try {
    result = await es.answer.explain(bot.config.luno.botId, text, answerId)
  } catch (err) {
    logger.error('Error executing explain', metadata({ err, bot, message }))
    return
  }

  let upload
  try {
    upload = await uploadResult({ bot, message, query: text, result })
  } catch (err) {
    logger.error('Error uploading result', metadata({ err, bot, message, result }))
    return
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

  bot.replyPrivate(message, `Results of validating query: \`${text}\`\n\`\`\`${JSON.stringify(result, undefined, '  ')}\`\`\``)
}

export async function handleAnalyze({ bot, message, text }) {
  const options = {
    analyzer: 'default_search',
  }
  let query = text
  if (text.includes('|')) {
    const parts = text.split('|')
    query = parts[0].trim()
    Object.assign(options, JSON.parse(parts[1].trim().replace(/[“”]/g, '"')))
  }

  let result
  try {
    result = await es.answer.analyze({ query, ...options })
  } catch (err) {
    logger.error('Error executing analyze', metadata({ err, bot, message, query, options }))
  }

  bot.replyPrivate(message, `Results of analyzing: \`${query}\`\n\`\`\`${JSON.stringify(result, undefined, '  ')}\`\`\``)
}

export function handleDefault({ bot, message }) {
  bot.replyPrivate(message, ':wave:')
}

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
    }
    return handleExplain({ bot, message, text, verbose })
  } else if (command.startsWith('validate')) {
    return handleValidate({ bot, message, text })
  } else if (command.startsWith('analyze')) {
    return handleAnalyze({ bot, message, text })
  }
  return handleDefault({ bot, message })
}
