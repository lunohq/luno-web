import Bluebird from 'bluebird'

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
