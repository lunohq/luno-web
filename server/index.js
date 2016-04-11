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
import jwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import { db } from 'luno-core';

import webpackConfig from '../webpack.config';
import requireUncached from './utils/requireUncached';
import config from './config/environment';
import schema from './data/schema';
import botkitStorage from './data/botkitStorage';
import updateSchema from './utils/updateSchema';

import { generateToken } from './actions';

let graphQLServer;
let relayServer;

const TOKEN_SECRET = 'shhhh';
const AUTH_COOKIE_KEY = 'atv1';
const COOKIE_SECRET = 'shhh!';

const botkit = Botkit.slackbot({
  storage: botkitStorage,
}).configureSlackApp({
  clientId: '22618016311.26511459793',
  clientSecret: '3dad74e3d7874065041063f4571639db',
  scopes: ['bot'],
});

function oauth(app) {
  // Serve oauth endpoints
  botkit.createOauthEndpoints(app, async (err, req, res) => {
    if (err) {
      // TODO better logging (more consistent);
      console.error('Failure', err);
      res.status(500).send(err);
    } else {
      let token;
      try {
        token = await generateToken(TOKEN_SECRET, { user: res.locals.user });
      } catch (err) {
        console.error('Failure', err);
        return res.status(500).send(err);
      }

      res.cookie(AUTH_COOKIE_KEY, token, { signed: true });
      res.redirect('/');
    }
    return res;
  });
}

function protect(app) {
  app.use(cookieParser(COOKIE_SECRET));
  app.use(jwt({
    secret: TOKEN_SECRET,
    getToken: req => {
      console.log('fetching token');
      return req.signedCookies.atv1;
    },
    isRevoked: async (req, payload, done) => {
      console.log('checking revoked', payload);
      let token;
      try {
        token = await db.token.getToken(payload.uid, payload.jti);
      } catch (err) {
        return done(err);
      }
      return done(null, !!token);
    },
    credentialsRequired: false,
  }));
}

function startGraphQLServer(schema) {
  const graphql = express();
  graphql.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema
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

    // XXX some issue here where it won't listen to the oauth endpoints if we
    // set this to true
    // historyApiFallback: true
  });

  // Serve static resources
  relayServer.use('/', express.static(path.join(__dirname, '../build')));

  oauth(relayServer.app);
  protect(relayServer.app);

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
  relayServer.use(historyApiFallback());
  relayServer.use('/', express.static(path.join(__dirname, '../build')));
  relayServer.use('/graphql', graphQLHTTP({ schema }));
  relayServer.listen(config.port, () => console.log(chalk.green(`Relay is listening on port ${config.port}`)));
}
