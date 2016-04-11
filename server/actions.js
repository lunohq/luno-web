import jwt from 'jsonwebtoken';

import { db } from 'luno-core';

export function generateToken(secret, { user }) {
  return new Promise(async (resolve, reject) => {
    let token;
    try {
      token = await db.token.createToken({ userId: user.id });
    } catch (err) {
      return reject(err);
    }

    const payload = {
      jti: token,
      uid: user.id,
      tid: user.team_id,
    };
    const output = jwt.sign(payload, secret);
    return resolve(output);
  });
}
