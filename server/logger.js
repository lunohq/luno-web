import winston from 'winston'
import RavenWinston from 'raven-winston'
import { merge } from 'lodash'
import VError from 'verror'

import config from './config/environment'

function rewriteError(level, msg, meta) {
  const output = {}
  if (meta instanceof Error) {
    output.err = {
      stack: VError.fullStack(meta),
      message: meta.message,
      extra: meta.extra,
    }
    return output
  }
  Object.assign(output, meta)
  if (meta.err) {
    output.err = {
      stack: VError.fullStack(meta.err),
      message: meta.err.message,
      extra: meta.err.extra,
    }
  }
  return output
}

function rewriteAuth(level, msg, meta) {
  const { auth, ...rest } = meta
  const output = merge({}, rest)
  if (auth) {
    output.auth = {
      teamId: auth.tid,
      userId: auth.uid,
      assumed: !!auth.a,
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

  const output = merge({}, meta)
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
  ],
})

if (process.env.NODE_ENV !== 'local') {
  logger.add(RavenWinston, { dsn: config.sentry.dsn, patchGlobal: true, level: 'warn' })
}

logger.rewriters.push(rewriteError)
logger.rewriters.push(rewriteAuth)
logger.rewriters.push(scrub)

export default logger
