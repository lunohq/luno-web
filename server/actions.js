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
      t: token,
      uid: user.id,
      tid: user.teamId,
    };
    const output = jwt.sign(payload, secret);
    return resolve(output);
  });
}
