import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import uuid from 'node-uuid'
import { db } from 'luno-core'

import config from '../config/environment'
import logger from '../logger'
import { uploadFileToLambda } from '../actions/file'

import d from '../utils/debug'
const debug = d(__filename)

const s3 = new AWS.S3()

const s3Upload = multer({
  storage: multerS3({
    s3,
    acl: config.files.acl,
    bucket: config.files.bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, {
        name: file.originalname,
        mimeType: file.mimetype,
      })
    },
    key: (req, file, cb) => {
      cb(null, `${req.auth.tid}/${uuid.v4()}`)
    },
  })
}).single('file')

async function lambdaUpload(req, res, next) {
  if (!(req.file && req.auth)) {
    return next()
  }

  const team = await db.team.getTeam(req.auth.tid)
  const params = {
    teamId: team.id,
    key: req.file.key,
    channelId: team.files.channelId,
  }
  debug('Invoking lambda function', { params })
  let payload
  try {
    payload = await uploadFileToLambda(params)
  } catch (err) {
    logger.error('Error uploading attachment', { err, params, file: req.file })
    return next(err)
  }

  req.file = {
    s3: req.file,
    lambda: payload,
  }
  return next()
}

export default function uploads(path, app) {
  app.use(path, s3Upload)
  app.use(path, lambdaUpload)
}
