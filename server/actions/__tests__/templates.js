import test from 'ava'
import sinon from 'sinon'
import { db } from 'luno-core'
import uuid from 'node-uuid'
import VError from 'verror'

import {
  arrayToMap,
  createOnboardingReplies,
  createOnboardingTemplate,
  createOnboardingTopics,
  getOnboardingTopicNames,
  getOnboardingAttachments,
  uploadOnboardingAttachments,
  uploadReplyAttachments,
} from '../templates'

const file = require('../file')

async function stubUploadFileToLambda({ key }) {
  const name = key.replace(/onboarding\//, '')
  return {
    name,
    id: `F${name}`,
    permalink: `https://slack.com/${name}`,
  }
}

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create()
})

test.afterEach(t => {
  t.context.sandbox.restore()
})

test('test get onboarding topics', t => {
  const topics = getOnboardingTopicNames()
  t.deepEqual(topics, ['Luno Tips & Tricks', 'Sample FAQs'])
})

test.serial('test creating topics', async t => {
  t.context.sandbox.stub(db.topic, 'createTopic', async ({ name, ...rest }) => {
    let id
    switch (name) {
      case 'Sample FAQs':
        id = 2
        break
      default:
        id = 1
    }
    return { name, id, ...rest }
  })
  const topics = await createOnboardingTopics({ teamId: 'T123', createdBy: 'U123' })
  t.is(topics['Luno Tips & Tricks'].id, 1)
  t.is(topics['Sample FAQs'].id, 2)
})

test('test get onboarding attachments', t => {
  const keys = getOnboardingAttachments()
  t.is(keys.length, 2)
})

test.serial('test uploading attachments', async t => {
  t.context.sandbox.stub(file, 'uploadFileToLambda', stubUploadFileToLambda)
  t.context.sandbox.stub(db.file, 'createFile', async (params) => params)
  const attachments = await uploadOnboardingAttachments({ teamId: 'T123', userId: 'U123', channelId: 'C123' })
  t.is(attachments.length, 2)
  attachments.forEach(attachment => {
    t.is(attachment.createdBy, 'U123')
    t.is(attachment.teamId, 'T123')
  })
})

test.serial('test uploading attachments error', async t => {
  t.context.sandbox.stub(file, 'uploadFileToLambda', () => { throw new Error('test error') })
  try {
    await uploadOnboardingAttachments({ teamId: 'T123', userId: 'U123', channelId: 'C123' })
  } catch (err) {
    t.truthy(err instanceof VError)
  }
})

test.serial('test upload reply attachments', async t => {
  t.context.sandbox.stub(file, 'uploadFileToLambda', stubUploadFileToLambda)
  t.context.sandbox.stub(db.file, 'createFile', async (params) => params)
  const replies = await uploadReplyAttachments({ teamId: 'T123', userId: 'U123', channelId: 'C123' })
  t.is(replies.length, 11)
  let attachments = []
  replies.forEach(reply => {
    if (reply.attachments) {
      reply.attachments.forEach(({ file }) => {
        t.truthy(file.id)
        t.truthy(file.name)
        t.truthy(file.permalink)
      })
      attachments = attachments.concat(reply.attachments)
    }
  })
  t.is(attachments.length, 2)
})

test('test array to map', t => {
  const array = [{ id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 }]
  const map = arrayToMap(array, 'id')
  t.is(map[1].value, 1)
  t.is(map[2].value, 2)
  t.is(map[3].value, 3)
})

test.serial('test creating onboarding replies', async t => {
  t.context.sandbox.stub(file, 'uploadFileToLambda', stubUploadFileToLambda)
  t.context.sandbox.stub(db.file, 'createFile', async (params) => params)
  t.context.sandbox.stub(db.topic, 'createTopic', async ({ name, ...rest }) => {
    let id
    switch (name) {
      case 'Sample FAQs':
        id = 3
        break
      default:
        id = 2
    }
    return { name, id, ...rest }
  })
  t.context.sandbox.stub(db.reply, 'createReply', async (params) => ({
    ...params,
    id: uuid.v4(),
  }))
  t.context.sandbox.stub(db.topic, 'getDefaultTopic', async (teamId) => ({
    id: 1,
    teamId,
  }))
  const replies = await createOnboardingReplies({ teamId: 'T123', userId: 'U123', channelId: 'C123' })
  t.is(replies.length, 11)
  let attachments = []
  const topics = {}
  replies.forEach(reply => {
    t.truthy(reply.id)
    t.truthy(reply.teamId)
    t.truthy(reply.createdBy)
    if (reply.topicId) {
      if (!topics[reply.topicId]) {
        topics[reply.topicId] = []
      }
      const replyTopics = topics[reply.topicId]
      replyTopics.push(reply.id)
    }
    if (reply.attachments) {
      reply.attachments.forEach(({ file }) => {
        t.truthy(file.id)
        t.truthy(file.name)
        t.truthy(file.permalink)
      })
      attachments = attachments.concat(reply.attachments)
    }
  })
  t.is(attachments.length, 2)
  t.is(Object.keys(topics).length, 3)
  t.is(topics[1].length, 1)
  t.is(topics[2].length, 5)
  t.is(topics[3].length, 5)
})

test.serial('test creating onboarding template', async t => {
  t.context.sandbox.stub(file, 'uploadFileToLambda', stubUploadFileToLambda)
  t.context.sandbox.stub(db.team, 'ranTemplate', async ({ id, template }) => ({
    id,
    templates: { [template]: new Date().toISOString() }
  }))
  t.context.sandbox.stub(db.file, 'createFile', async (params) => params)
  t.context.sandbox.stub(db.topic, 'createTopic', async ({ name, ...rest }) => {
    let id
    switch (name) {
      case 'Sample FAQs':
        id = 3
        break
      default:
        id = 2
    }
    return { name, id, ...rest }
  })
  t.context.sandbox.stub(db.reply, 'createReply', async (params) => ({
    ...params,
    id: uuid.v4(),
  }))
  t.context.sandbox.stub(db.topic, 'getDefaultTopic', async (teamId) => ({
    id: 1,
    teamId,
  }))
  const { replies, team } = await createOnboardingTemplate(
    { teamId: 'T123', botId: 'U123', channelId: 'C123' })
  t.truthy(team.templates[db.team.ONBOARDING_TEMPLATE])
  t.is(replies.length, 11)
  let attachments = []
  const topics = {}
  replies.forEach(reply => {
    t.truthy(reply.id)
    t.truthy(reply.teamId)
    t.truthy(reply.createdBy)
    t.is(reply.topic_name, undefined)
    if (!reply.keywords) {
      t.is(reply.keywords, undefined)
    }
    if (reply.topicId) {
      if (!topics[reply.topicId]) {
        topics[reply.topicId] = []
      }
      const replyTopics = topics[reply.topicId]
      replyTopics.push(reply.id)
    }
    if (reply.attachments) {
      reply.attachments.forEach(({ file }) => {
        t.truthy(file.id)
        t.truthy(file.name)
        t.truthy(file.permalink)
      })
      attachments = attachments.concat(reply.attachments)
    }
  })
  t.is(attachments.length, 2)
  t.is(Object.keys(topics).length, 3)
  t.is(topics[1].length, 1)
  t.is(topics[2].length, 5)
  t.is(topics[3].length, 5)
})
