import winston from 'winston'
import RavenWinston from 'raven-winston'

import config from './config/environment'

export default new winston.Logger({
  transports: [
    new winston.transports.Console({ level: config.winston.logger.console.level }),
    new RavenWinston({ dsn: config.sentry.dsn, patchGlobal: true, level: 'warn' }),
  ],
})
