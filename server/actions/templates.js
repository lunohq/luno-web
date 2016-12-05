import { db } from 'luno-core'
import VError from 'verror'

import config from '../config/environment'
import onboarding from '../templates/onboarding.json'
import { uploadFileToLambda } from './file'

import d from '../utils/debug'
const debug = d(__filename)

export function arrayToMap(array, key) {
  const output = {}
  array.forEach(obj => {
    output[obj[key]] = obj
  })
  return output
}

export function getOnboardingTopicNames() {
  const topicNames = []
  onboarding.forEach(reply => {
    if (reply.topic_name && !topicNames.includes(reply.topic_name)) {
      topicNames.push(reply.topic_name)
    }
  })
  return topicNames
}

export function getOnboardingAttachments() {
  const attachments = []
  onboarding.forEach(reply => {
    if (reply.attachments) {
      const parts = reply.attachments.split(',')
      parts.forEach(part => attachments.push(part.trim()))
    }
  })
  return attachments
}

export async function createOnboardingTopics({ teamId, userId: createdBy }) {
  const topicNames = getOnboardingTopicNames()
  const topics = []
  for (const name of topicNames) {
    const params = {
      name,
      createdBy,
      teamId,
    }
    let topic
    try {
      topic = await db.topic.createTopic(params)
    } catch (err) {
      throw new VError(err, 'error creating topic')
    }
    topics.push(topic)
  }
  return arrayToMap(topics, 'name')
}

export async function uploadOnboardingAttachments({ teamId, channelId, userId }) {
  let attachments
  try {
    attachments = await getOnboardingAttachments()
  } catch (err) {
    throw new VError(err, 'error fetching onboarding attachments')
  }
  if (!attachments.length) {
    return Promise.resolve([])
  }
  const promises = attachments.map(async (key) => {
    let upload
    try {
      upload = await uploadFileToLambda({ teamId, channelId, key })
    } catch (err) {
      throw new VError(err, 'error uploading file to lambda')
    }
    const params = {
      teamId,
      key,
      id: upload.id,
      name: upload.name,
      permalink: upload.permalink,
      created: upload.created,
      bucket: config.files.bucket,
      createdBy: userId,
    }
    debug('Creatig file', { params, upload })
    return db.file.createFile(params)
  })

  let results
  try {
    results = await Promise.all(promises)
  } catch (err) {
    throw new VError(err, 'error uploading attachments')
  }
  return results
}

export async function uploadReplyAttachments({ teamId, channelId, userId }) {
  let files
  try {
    files = await uploadOnboardingAttachments({ teamId, channelId, userId })
  } catch (err) {
    throw new VError(err, 'error uploadig attachments')
  }

  const fileMap = arrayToMap(files, 'key')
  return onboarding.map(reply => {
    const attachments = []
    if (reply.attachments) {
      const keys = reply.attachments.split(',')
      keys.forEach(key => {
        const attachment = fileMap[key]
        if (attachment) {
          const { id, name, permalink } = attachment
          attachments.push({ file: { id, name, permalink } })
        }
      })
    }
    return {
      ...reply,
      attachments,
    }
  })
}

export async function createOnboardingReplies({ teamId, userId, channelId }) {
  const promises = [
    createOnboardingTopics({ teamId, userId }),
    uploadReplyAttachments({ teamId, channelId, userId }),
  ]
  let results
  try {
    results = await Promise.all(promises)
  } catch (err) {
    throw new VError(err, 'error creating topics and attachments')
  }

  let defaultTopic
  try {
    defaultTopic = await db.topic.getDefaultTopic(teamId)
  } catch (err) {
    throw new VError(err, 'error fetching default topic')
  }

  const [topics, replies] = results

  results = []
  for (const reply of replies) {
    const { attachments, body, keywords, title } = reply
    const params = {
      attachments,
      teamId,
      body,
      title,
      createdBy: userId,
    }
    if (reply.topic_name) {
      const topic = topics[reply.topic_name]
      params.topicId = topic.id
    } else {
      params.topicId = defaultTopic.id
    }
    if (keywords) {
      params.keywords = keywords
    }

    let result
    try {
      result = await db.reply.createReply(params)
    } catch (err) {
      throw new VError(err, 'error creating reply')
    }
    results.push(result)
  }
  return results
}

export async function createOnboardingTemplate({ teamId, channelId, botId: userId }) {
  let replies
  try {
    replies = await createOnboardingReplies({ teamId, channelId, userId })
  } catch (err) {
    throw new VError(err, 'error creating onboarding replies')
  }

  let team
  try {
    team = await db.team.ranTemplate({ id: teamId, template: db.team.ONBOARDING_TEMPLATE })
  } catch (err) {
    throw new VError(err, 'error recording template ran')
  }

  return {
    team,
    replies,
  }
}
