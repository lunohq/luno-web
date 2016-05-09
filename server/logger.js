import winston from 'winston'
import RavenWinston from 'raven-winston'

import config from './config/environment'

export function metadata({ bot, err, ...other }) {
  let data = {}
  if (bot && bot.config) {
    data = { luno: bot.config.luno }
  } else {
    data = { bot }
  }

  if (err) {
    data.err = { stack: err.stack, message: err.message }
  }
  return Object.assign({}, other, data)
}

export default new winston.Logger({
  transports: [
    new winston.transports.Console({ level: config.winston.logger.console.level }),
    new RavenWinston({ dsn: config.sentry.dsn, patchGlobal: true, level: 'warn' }),
  ],
})
