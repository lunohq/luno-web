import cookieParser from 'cookie-parser'
import jwt from 'express-jwt'
import { db } from 'luno-core'

import config from '../config/environment'
import { generateToken, setCookie } from '../actions/auth'
import logger, { metadata } from '../logger'

const debug = require('debug')('server:middleware:auth')

/**
 * Use converse to handle the oauth process.
 *
 * If we successfully auth a user, we'll generate a token and store it in a
 * cookie.
 *
 * @param {Object} converse converse.Server instance
 * @param {Object} app express app
 */
function oauth(converse, app) {
  converse.createAuthEndpoints(app, async (err, req, res) => {
    if (err) {
      logger.error('OAuth Failure', metadata({ query: req.query, err }))
      return res.redirect('/')
    }

    if (req.query.error) {
      logger.error('OAuth Error', { error: req.query.error, query: req.query })
      return res.redirect('/')
    }

    const { locals: { team } } = res
    let { locals: { user } } = res
    if (team.createdBy === user.id) {
      debug('New team, auto upgrading to admin', { user })
      user = await db.user.updateUserRole({ id: user.id, role: db.user.ADMIN })
    }

    debug('Checking if app is installed', { team })
    if (!team.slack || !team.slack.bot) {
      logger.info('Routing initial user through install', { team: res.locals.team, user: res.locals.user })
      return res.redirect(converse.getInstallURL(team.id))
    }

    let token
    try {
      token = await generateToken({ secret: config.token.secret, user: res.locals.user })
    } catch (err) {
      logger.error('OAuth Token Transfer Failure', metadata({ query: req.query.error, err }))
      return res.redirect('/')
    }

    setCookie({ res, token })
    return res.redirect('/')
  })
}

export default function auth(app, converse) {
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
  // TODO this should be cached in redis
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

  if (converse) {
    oauth(converse, app)
  }
}
