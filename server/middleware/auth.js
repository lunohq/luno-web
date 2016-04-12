import cookieParser from 'cookie-parser';
import jwt from 'express-jwt';
import { db } from 'luno-core';

import { generateToken } from '../actions';

const TOKEN_SECRET = 'shhhh';
const AUTH_COOKIE_KEY = 'atv1';
const COOKIE_SECRET = 'shhh!';
// Cookie should last for 365 days
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365;

/**
 * Use botkit to handle the oauth process.
 *
 * If we successfully auth a user, we'll generate a token and store it in a
 * cookie.
 *
 * @param {Object} botkit botkit instance
 * @param {Object} app express app
 */
function oauth(botkit, app) {
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

      res.cookie(AUTH_COOKIE_KEY, token, { maxAge: COOKIE_MAX_AGE, signed: true });
      res.redirect('/');
    }
    return res;
  });
}

export default function (app, botkit) {
  // cookieParser is required so we can read and write cookie values
  app.use(cookieParser(COOKIE_SECRET));

  // jwt unpacks the jwt token if present and stores credential information on
  // req.auth
  app.use(jwt({
    secret: TOKEN_SECRET,
    getToken: req => req.signedCookies.atv1,
    credentialsRequired: false,
    requestProperty: 'auth',
  }));

  // ensure the auth information is still valid, if not, remove the cookie.
  app.use(async (req, res, next) => {
    if (req.auth) {
      let token;
      try {
        token = await db.token.getToken(req.auth.uid, req.auth.t.id);
      } catch (err) {
        return next(err);
      }

      if (!token && req.auth) {
        delete req.auth;
        res.clearCookie(AUTH_COOKIE_KEY);
      }
    }
    return next();
  });

  if (botkit) {
    oauth(botkit, app);
  }
}
