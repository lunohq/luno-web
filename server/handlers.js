import logger, { metadata } from './logger'

import { search, uploadResult } from './actions/search'

export function handleSlashCommand(bot, message) {
  let command
  let text
  const parts = message.text.split(' ')
  if (parts) {
    command = parts[0]
    text = parts.slice(1).join(' ')
  }

  if (command === 'explain') {
    return handleExplain({ bot, message, text })
  } else {
    return handleDefault({ bot, message })
  }
}

function formatResult({ _source: source, _score: score }) {
  return `*title:* ${source.title}, *score*: ${score}`
}

function explainResults({ bot, message, query, result }) {
  return new Promise(async (resolve) => {
    const parts = [`Found the following results for: *${query}*`]
    const formattedResults = result.hits.hits.map(hit => formatResult(hit))
    parts.push(...formattedResults)

    let upload
    try {
      upload = await uploadResult({ bot, message, query, result })
    } catch (err) {
      logger.error('Error uploading result', metadata({ bot, message, err, query, result }))
      return reject()
    }

    bot.replyPrivate(message, parts.join('\n'))
    bot.replyPrivateDelayed(message, `Full explanation: ${upload.permalink}`, (err) => {
      if (err) {
        logger.error('Error sending delayed message', metadata({ err, message }))
      }
    })
    return resolve()
  })
}

export async function handleExplain({ bot, message, text }) {
  let result
  try {
    result = await search(bot.config.luno.botId, text)
  } catch (err) {
    logger.error('Error executing search', metadata({ err, bot, message }))
  }
  try {
    await explainResults({ bot, message, query: text, result })
  } catch (err) {
    logger.error('Error explaining results', metadata({ err, bot, message, result }))
  }
}

export function handleDefault({ bot, message }) {
  bot.replyPrivate(message, ':wave:')
}
