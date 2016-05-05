import cookieParser from 'cookie-parser'
import jwt from 'express-jwt'
import { db } from 'luno-core'

import config from '../config/environment'
import { generateToken } from '../actions/auth'
import logger from '../logger'

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
      logger.error('OAuth Failure', { query: req.query }, err)
      return res.redirect('/')
    }

    if (req.query.error) {
      logger.error('OAuth Error', { error: req.query.error, query: req.query })
      return res.redirect('/')
    }

    let token
    try {
      token = await generateToken(config.token.secret, { user: res.locals.user })
    } catch (err) {
      logger.error('OAuth Token Transfer Failure', { query: req.query.error }, err)
      return res.redirect('/')
    }

    res.cookie(config.cookie.key, token, { maxAge: config.cookie.maxAge, signed: true })
    return res.redirect('/')
  })
}

export default function (app, botkit) {
  // cookieParser is required so we can read and write cookie values
  app.use(cookieParser(config.cookie.secret))

  // jwt unpacks the jwt token if present and stores credential information on
  // req.auth
  app.use(jwt({
    secret: config.token.secret,
    getToken: req => req.signedCookies.atv1,
    credentialsRequired: false,
    requestProperty: 'auth',
  }))

  // ensure the auth information is still valid, if not, remove the cookie.
  app.use(async (req, res, next) => {
    if (req.auth) {
      let token
      try {
        token = await db.token.getToken(req.auth.uid, req.auth.t.id)
      } catch (err) {
        return next(err)
      }

      if (!token && req.auth) {
        delete req.auth
        res.clearCookie(config.cookie.key)
      }
    }
    return next()
  })

  if (botkit) {
    oauth(botkit, app)
  }
}
