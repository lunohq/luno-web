import winston from 'winston'
import RavenWinston from 'raven-winston'

import config from './config/environment'

function rewriteError(level, msg, meta) {
  const output = {}
  if (meta instanceof Error) {
    output.err = {
      stack: meta.stack,
      message: meta.message,
      extra: meta.extra,
    }
    return output
  }
  Object.assign(output, meta)
  if (meta.err) {
    output.err = {
      stack: meta.err.stack,
      message: meta.err.message,
      extra: meta.err.extra,
    }
  }
  return output
}

function scrub(level, msg, meta) {
  const protectedKeys = ['token', 'accessToken']

  function _scrub(obj) {
    for (const key of Object.keys(obj)) {
      if (protectedKeys.includes(key)) {
        obj[key] = '********'
        continue
      }
      const value = obj[key]
      if (typeof value === 'object') {
        _scrub(value)
      }
    }
  }
  const output = Object.assign({}, meta)
  _scrub(output)
  return output
}

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

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config.winston.logger.console.level,
      depth: config.winston.logger.console.depth,
      prettyPrint: config.winston.logger.console.prettyPrint,
    }),
    new RavenWinston({ dsn: config.sentry.dsn, patchGlobal: true, level: 'warn' }),
  ],
})

logger.rewriters.push(rewriteError)
logger.rewriters.push(scrub)

export default logger
