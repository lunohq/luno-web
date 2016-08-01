import { fromGlobalId } from 'graphql-relay'

export function formatAttachments(rawAttachments) {
  let attachments
  if (rawAttachments) {
    attachments = []
    rawAttachments.forEach(({ file: { id: globalId, ...rest } }) => {
      const { id } = fromGlobalId(globalId)
      attachments.push({ file: { id, ...rest } })
    })
  }
  return attachments
}

export default {
  formatAttachments,
}
