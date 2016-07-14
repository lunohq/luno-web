/* eslint-disable no-console, no-shadow */
import path from 'path'
import webpack from 'webpack'
import express from 'express'
import graphQLHTTP from 'express-graphql'
import WebpackDevServer from 'webpack-dev-server'
import gaze from 'gaze'
import chalk from 'chalk'
import morgan from 'morgan'

import webpackConfig from '../webpack/local'
import requireUncached from './utils/requireUncached'
import formatError from './utils/formatError'
import config from './config/environment'
import schema from './graphql/schema'
import updateSchema from './utils/updateSchema'
import auth from './middleware/auth'
import slashCommands from './middleware/slashCommands'
import admin from './middleware/admin'
import getDataStore from './utils/getDataStore'

import converse from './converse'

let graphQLServer
let relayServer

function startGraphQLServer(schema) {
  const graphql = express()
  auth(graphql)
  graphql.use('/', graphQLHTTP(request => {
    return {
      graphiql: true,
      pretty: true,
      context: { auth: request.auth, dataStore: getDataStore(request.auth) },
      schema,
      formatError,
    }
  }))
  graphQLServer = graphql.listen(
    config.graphql.port,
    () => console.log(chalk.green(`GraphQL is listening on port ${config.graphql.port}`)),
  )
}

function startRelayServer() {
  function noop(ctx) {
    return ctx.parsedUrl.pathname
  }

  // Launch Relay by using webpack.config.js
  relayServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/build/',
    proxy: {
      '/graphql': `http://localhost:${config.graphql.port}`
    },
    stats: 'errors-only',
    hot: true,
    historyApiFallback: {
      verbose: true,
      // historyApiFallback doesn't wait till we get a 404 to rewrite to
      // index.html. This is required so we can access these urls.
      rewrites: [
        { from: /\/login/, to: noop },
        { from: /\/oauth/, to: noop },
        { from: /\/l\/admin/, to: noop },
      ],
    },
  })

  relayServer.use(morgan('short'))
  auth(relayServer.app, converse)
  slashCommands(relayServer.app, converse)
  admin(relayServer.app)
  // Serve static resources
  relayServer.use('/', express.static(path.join(__dirname, '../build')))

  relayServer.listen(config.port, () => {
    console.log(chalk.green(`Relay is listening on port ${config.port}`))
  })
}

// Start GraphQL and Relay servers
startGraphQLServer(schema)
startRelayServer()

// Watch JavaScript files in the data folder for changes, and update schema.json and schema.graphql
gaze(path.join(__dirname, 'graphql/**.js'), (err, watcher) => {
  if (err) console.error(chalk.red('Error: Watching files in data folder'))
  watcher.on('all', async () => {
    try {
      // Close the GraphQL server, update the schema.json and schema.graphql, and start the server again
      graphQLServer.close()
      await updateSchema()
      const newSchema = requireUncached(path.join(__dirname, './graphql/schema')).default
      startGraphQLServer(newSchema)

      // Close the Relay server, and start it again
      relayServer.listeningApp.close()
      startRelayServer()
    } catch (e) {
      console.error(chalk.red(e.stack))
    }
  })
})
