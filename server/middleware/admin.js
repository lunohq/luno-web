import { db } from 'luno-core'

import logger, { metadata } from '../logger'
import config from '../config/environment'
import { generateToken, setCookie } from '../actions/auth'

function isValid(token) {
  const now = new Date()
  const created = new Date(token.created)
  // get the diff in minutes
  const diff = (now - created) / 1000 / 60

  let valid = true
  let message
  if (token.ended) {
    valid = false
    message = 'Session has already ended'
  } else if (token.targetTokenId) {
    valid = false
    message = 'Session has already been claimed'
  } else if (diff > 5) {
    valid = false
    message = 'Session has expired'
  }

  return { valid, message }
}

async function assumeToken(req, res) {
  const id = req.params.tokenId
  let adminToken = await db.admin.getToken(id)
  if (!adminToken) {
    logger.warn('Failed attempt to assume user.', { id })
    return res.redirect('/')
  }

  const { valid, message } = isValid(adminToken)
  if (!valid) {
    logger.warn(message, { id })
    return res.redirect('/')
  }

  const targetToken = await db.token.createToken({ userId: adminToken.targetUserId })
  adminToken = await db.admin.trackToken({ id, targetTokenId: targetToken.id })
  const token = await generateToken({
    adminToken,
    token: targetToken,
    secret: config.token.secret,
    user: { id: adminToken.targetUserId, teamId: adminToken.targetTeamId },
  })
  logger.info('Claimed session', { id })
  setCookie({ res, token })
  return res.redirect('/')
}

export default function (app) {
  app.get('/admin/:tokenId', async (req, res) => {
    try {
      await assumeToken(req, res)
    } catch (err) {
      logger.error('Error assuming token', metadata({ err }))
    }
  })
}
