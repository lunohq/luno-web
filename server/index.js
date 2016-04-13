/* eslint-disable no-console, no-shadow */
import path from 'path';
import webpack from 'webpack';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import WebpackDevServer from 'webpack-dev-server';
import historyApiFallback from 'connect-history-api-fallback';
import gaze from 'gaze';
import chalk from 'chalk';
import Botkit from 'botkit';
import { botkit as bk } from 'luno-core';
import morgan from 'morgan';

import webpackConfig from '../webpack.config';
import requireUncached from './utils/requireUncached';
import config from './config/environment';
import schema from './data/schema';
import updateSchema from './utils/updateSchema';
import auth from './middleware/auth';

let graphQLServer;
let relayServer;

const botkit = Botkit.slackbot({
  storage: bk.storage,
}).configureSlackApp({
  clientId: config.slack.clientId,
  clientSecret: config.slack.clientSecret,
  scopes: ['bot'],
});

function startGraphQLServer(schema) {
  const graphql = express();
  auth(graphql);
  graphql.use('/', graphQLHTTP(request => {
    return {
      graphiql: true,
      pretty: true,
      context: { auth: request.auth },
      rootValue: request.auth,
      schema,
    };
  }));
  graphQLServer = graphql.listen(
    config.graphql.port,
    () => console.log(chalk.green(`GraphQL is listening on port ${config.graphql.port}`)),
  );
}

function startRelayServer() {
  // Launch Relay by using webpack.config.js
  relayServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/build/',
    proxy: {
      '/graphql': `http://localhost:${config.graphql.port}`
    },
    stats: {
      colors: true
    },
    hot: true,
    historyApiFallback: {
      verbose: true,
      // historyApiFallback doesn't wait till we get a 404 to rewrite to
      // index.html. This is required so we can access these urls.
      rewrites: [
        { from: /\/login/, to: '/login' },
        { from: /\/oauth/, to: '/oauth' },
      ],
    },
  });

  relayServer.use(morgan('short'));
  auth(relayServer.app, botkit);
  // Serve static resources
  relayServer.use('/', express.static(path.join(__dirname, '../build')));

  relayServer.listen(config.port, () => {
    console.log(chalk.green(`Relay is listening on port ${config.port}`));
  });
}

if (config.env === 'development') {
  // Start GraphQL and Relay servers
  startGraphQLServer(schema);
  startRelayServer();

  // Watch JavaScript files in the data folder for changes, and update schema.json and schema.graphql
  gaze(path.join(__dirname, 'data/*.js'), (err, watcher) => {
    if (err) console.error(chalk.red('Error: Watching files in data folder'));
    watcher.on('all', async () => {
      try {
        // Close the GraphQL server, update the schema.json and schema.graphql, and start the server again
        graphQLServer.close();
        await updateSchema();
        const newSchema = requireUncached(path.join(__dirname, './data/schema')).default;
        startGraphQLServer(newSchema);

        // Close the Relay server, and start it again
        relayServer.listeningApp.close();
        startRelayServer();
      } catch (e) {
        console.error(chalk.red(e.stack));
      }
    });
  });
} else if (config.env === 'production') {
  // Launch Relay by creating a normal express server
  relayServer = express();
  relayServer.use(morgan('short'));
  auth(relayServer, botkit);
  relayServer.use(historyApiFallback());
  relayServer.use('/', express.static(path.join(__dirname, '../build')));
  relayServer.use('/graphql', graphQLHTTP(request => ({
    schema,
    context: { auth: request.auth },
    rootValue: request.auth,
  })));
  relayServer.listen(config.port, () => console.log(chalk.green(`Relay is listening on port ${config.port}`)));
}
