import AWS from 'aws-sdk'
import { db } from 'luno-core'

import { deleteFiles as deleteFromSlack } from './slack'

const s3 = new AWS.S3()

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

export async function deleteFiles({ fileIds, teamId }) {
  const files = await db.file.getFiles({ teamId, ids: fileIds })
  await db.file.deleteFiles({ teamId, ids: fileIds })

  await Promise.all([
    deleteFromS3(files),
    deleteFromSlack({ teamId, ids: fileIds }),
  ])
}
