import AWS from 'aws-sdk'
import { db } from 'luno-core'
import getClient from 'luno-core/lib/redis/getClient'
import crypto from 'crypto'
import VError from 'verror'

import config from '../config/environment'
import { deleteFiles as deleteFromSlack } from './slack'

let redis
const s3 = new AWS.S3()
const lambda = new AWS.Lambda()

import d from '../utils/debug'
const debug = d(__filename)

function getRedisClient() {
  if (!redis) {
    redis = getClient()
  }
  return redis
}

function deleteFromS3(files) {
  const buckets = {}
  files.forEach(file => {
    if (!buckets[file.bucket]) {
      buckets[file.bucket] = []
    }
    buckets[file.bucket].push(file)
  })

  const promises = []
  Object.keys(buckets).forEach(bucket => {
    const files = buckets[bucket]
    const params = {
      Bucket: bucket,
      Delete: {
        Objects: files.map(file => ({ Key: file.key })),
      },
    }
    promises.push(s3.deleteObjects(params).promise())
  })
  return Promise.all(promises)
}

export async function deleteFiles({ files = [], fileIds, teamId }) {
  debug('deleteFiles', { files, fileIds, teamId })
  if (files.length) {
    fileIds = files.map(file => file.id)
  } else {
    files = await db.file.getFiles({ teamId, ids: fileIds })
  }

  debug('Deleting files', { fileIds, teamId, files })
  await db.file.deleteFiles({ teamId, ids: fileIds })
  await Promise.all([
    deleteFromS3(files),
    deleteFromSlack({ teamId, ids: fileIds }),
  ])
}

export async function deleteFile({ file, teamId }) {
  return Promise.all([
    deleteFromS3([file]),
    deleteFromSlack({ teamId, ids: [file.id] }),
  ])
}

function cancelUploadKey({ teamId, userId, mutationId, name }) {
  const hash = crypto.createHash('md5').update(name).digest('hex')
  return `cu.${teamId}.${userId}.${mutationId}.${hash}`
}

export function cancelFileUploads({ uploads, teamId, userId }) {
  const redis = getRedisClient()
  let multi = redis.multi()
  uploads.forEach(({ name, mutationId }) => {
    const key = cancelUploadKey({ teamId, userId, mutationId, name })
    multi = multi.set(key, true).expire(key, 300)
  })
  return multi.execAsync()
}

export async function wasCancelled({ mutationId, teamId, userId, name }) {
  const redis = getRedisClient()
  const key = cancelUploadKey({ teamId, userId, mutationId, name })
  const response = await redis.multi().get(key).del(key).execAsync()
  return response[0]
}

export async function createFile({ userId, teamId, upload, mutationId }) {
  let file = await db.file.createFile({
    teamId,
    createdBy: userId,
    id: upload.lambda.id,
    name: upload.lambda.name,
    permalink: upload.lambda.permalink,
    key: upload.s3.key,
    bucket: upload.s3.bucket,
    created: upload.lambda.created,
  })
  const redis = getRedisClient()
  const key = cancelUploadKey({ teamId, userId, mutationId, name: file.name })
  const response = await redis.multi().setnx(key, JSON.stringify(file)).expire(key, 5).execAsync()
  if (!response[0]) {
    await deleteFiles({ files: [file], teamId })
    file = null
    await redis.delAsync(key)
  }
  return file
}

export async function uploadFileToLambda({ teamId, key, channelId }) {
  const params = { teamId, key, channelId }
  let response
  try {
    response = await lambda.invoke({
      FunctionName: config.files.functionArn,
      Payload: JSON.stringify(params),
    }).promise()
  } catch (err) {
    throw new VError(err, 'error uploading file to lambda')
  }

  if (response.StatusCode !== 200) {
    throw new Error('error invoking lambda function')
  }

  let payload
  try {
    payload = JSON.parse(response.Payload)
  } catch (err) {
    throw new VError(err, 'error parsing file payload')
  }
  return payload
}
