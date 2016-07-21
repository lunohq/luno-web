import cookieParser from 'cookie-parser'
import jwt from 'express-jwt'
import { WebClient } from '@slack/client'
import { db } from 'luno-core'

import config from '../config/environment'
import { generateToken, setCookie } from '../actions/auth'
import { isBotInstalled } from '../actions/slack'
import { sendNewTrainerNotification, sendReactivatedNotification } from '../actions/notifications'
import logger, { metadata } from '../logger'

const debug = require('debug')('server:middleware:auth')

async function updateUserDetails({ user, team }) {
  const client = new WebClient(team.slack.bot.token)
  let userDetails
  try {
    userDetails = await client.users.info(user.id)
  } catch (err) {
    logger.error('Error fetching user details', { err, user, team })
  }

  if (userDetails && !userDetails.ok) {
    logger.error('Error fetching user details', { details: userDetails })
  }

  if (
    user.role === undefined ||
    // handle bumping old consumers to trainers. we should remove this once we
    // no longer have any consumers or want to enable consumers again.
    user.role === db.user.CONSUMER ||
    // handle user re-installing the app
    team.status === db.team.STATUS_INACTIVE
  ) {
    if (team.createdBy === user.id || team.status === db.team.STATUS_INACTIVE) {
      debug('Setting role to ADMIN', { team, user })
      user.role = db.user.ADMIN
    } else {
      debug('Setting role to TRAINER', { team, user })
      user.role = db.user.TRAINER
      try {
        await sendNewTrainerNotification({ team, userId: user.id })
      } catch (err) {
        logger.error('Error sending new trainer notification', { err, team, user })
      }
    }
  }

  if (userDetails) {
    debug('Updating user details', { userDetails })
    const { user: { name, profile } } = userDetails
    user.user = name
    user.profile = profile
  }

  if (user.role === db.user.ADMIN && team.status === db.team.STATUS_INACTIVE) {
    // activate the team if someone has reinstalled it
    await Promise.all([
      db.team.activateTeam(team.id),
      sendReactivatedNotification({ team, userId: user.id }),
    ])
  }

  return db.user.updateUser(user)
}

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

    const { locals: { team, isNew } } = res
    let { locals: { user } } = res

    debug('Checking if app is installed', { team })
    const installed = await isBotInstalled(team)
    debug('App install status', { installed })
    if (!installed) {
      if (!isNew.team && team.status !== db.team.STATUS_INACTIVE) {
        logger.info('Deactivating uninstalled team')
        await db.team.deactivateTeam(team.id)
      }
      logger.info('Routing initial user through install', { team: res.locals.team, user: res.locals.user })
      return res.redirect(converse.getInstallURL(team.id))
    }

    try {
      user = await updateUserDetails({ user, team })
    } catch (err) {
      logger.error('Error updating user details', { user, team, err })
    }

    let token
    try {
      token = await generateToken({ secret: config.token.secret, user })
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
