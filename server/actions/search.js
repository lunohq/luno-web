import Bluebird from 'bluebird'
import { es } from 'luno-core'

export function search(botId, query) {
  return new Promise(async (resolve, reject) => {
    let result
    try {
      result = await es.answer.search(botId, query)
    } catch (err) {
      return reject(err)
    }
    return resolve(result)
  })
}

export function uploadResult({ bot, message, result, query }) {
  return new Promise(async (resolve, reject) => {
    const im = Bluebird.promisify(bot.api.im.open)
    const upload = Bluebird.promisify(bot.api.files.upload)
    let channel
    try {
      channel = await im({ user: message.user })
    } catch (err) {
      return reject(err)
    }

    const payload = {
      content: JSON.stringify(result, undefined, '  '),
      filetype: 'javascript',
      filename: `explain-result-${message.channel}-${message.ts}`,
      title: `Explanation for: \`${query}\``,
      channels: channel.channel.id,
    }

    let file
    try {
      file = await upload(payload)
    } catch (err) {
      return reject(err)
    }

    if (!file.ok) {
      return reject(file.ok)
    }

    return resolve(file.file)
  })
}
