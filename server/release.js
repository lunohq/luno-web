/* eslint-disable no-console, no-shadow */
import path from 'path'
import express from 'express'
import graphQLHTTP from 'express-graphql'
import historyApiFallback from 'connect-history-api-fallback'
import chalk from 'chalk'
import morgan from 'morgan'
import { HTTPS as enforceHttps } from 'express-sslify'
import raven from 'raven'

import config from './config/environment'
import schema from './data/schema'
import auth from './middleware/auth'
import slashCommands from './middleware/slashCommands'
import admin from './middleware/admin'

import converse from './converse'

// Launch Relay by creating a normal express server
const relayServer = express()

relayServer.use(raven.middleware.express.requestHandler(config.sentry.dsn))

if (config.ssl) {
  relayServer.use(enforceHttps({ trustProtoHeader: true }))
}

relayServer.use(morgan('short'))
auth(relayServer, converse)
slashCommands(relayServer, converse)
admin(relayServer)
relayServer.use(historyApiFallback())
relayServer.use('/', express.static(path.join(__dirname, '../output', process.env.NODE_ENV)))
relayServer.use('/graphql', graphQLHTTP(request => ({
  schema,
  context: { auth: request.auth },
})))
relayServer.use(raven.middleware.express.errorHandler(config.sentry.dsn))
relayServer.listen(config.port, () => console.log(chalk.green(`Relay is listening on port ${config.port}`)))
