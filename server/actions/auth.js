import jwt from 'jsonwebtoken'
import { db } from 'luno-core'

import config from '../config/environment'

export async function generateToken({ secret, user, token, adminToken }) {
  if (!token) {
    token = await db.token.createToken({ userId: user.id })
  }
  const payload = {
    t: token,
    uid: user.id,
    tid: user.teamId,
    a: adminToken,
  }
  const output = jwt.sign(payload, secret)
  return output
}

export function setCookie({ res, token }) {
  res.cookie(config.cookie.key, token, { maxAge: config.cookie.maxAge, signed: true })
}

export default {
  generateToken,
  setCookie,
}
