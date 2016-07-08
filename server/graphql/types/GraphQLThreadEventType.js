import { db } from 'luno-core'
import { GraphQLEnumType } from 'graphql'

import { registerType } from './registry'
export const EVENT_MESSAGE_RECEIVED = 0
export const EVENT_MESSAGE_SENT = 1
export const EVENT_GREETING_FLOW = 2
export const EVENT_HELP_FLOW = 3
export const EVENT_HUMAN_FLOW = 4
export const EVENT_ANSWER_FLOW = 5
export const EVENT_FEEDBACK = 6
export const EVENT_SMART_ANSWER = 7
export const EVENT_MULTIPLE_RESULTS = 9
export const EVENT_NO_RESULTS = 10
export const EVENT_CLARIFICATION = 11
export const EVENT_ESCALATION_FLOW = 12

const GraphQLThreadEventType = new GraphQLEnumType({
  name: 'ThreadEventType',
  values: {
    MESSAGE_RECEIVED: { value: db.thread.EVENT_MESSAGE_RECEIVED },
    MESSAGE_SENT: { value: db.thread.EVENT_MESSAGE_SENT },
    GREETING_FLOW: { value: db.thread.EVENT_GREETING_FLOW },
    HELP_FLOW: { value: db.thread.EVENT_HELP_FLOW },
    ANSWER_FLOW: { value: db.thread.EVENT_ANSWER_FLOW },
    FEEDBACK: { value: db.thread.EVENT_FEEDBACK },
    SMART_REPLY: { value: db.thread.EVENT_SMART_ANSWER },
    MULTIPLE_RESULTS: { value: db.thread.EVENT_MULTIPLE_RESULTS },
    NO_RESULTS: { value: db.thread.EVENT_NO_RESULTS },
    CLARIFICATION: { value: db.thread.EVENT_CLARIFICATION },
    ESCALATION_FLOW: { value: db.thread.EVENT_ESCALATION_FLOW },
  },
})

export default registerType({ type: GraphQLThreadEventType })
