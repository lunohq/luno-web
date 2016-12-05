export function formatAttachments(rawAttachments) {
  let attachments
  if (rawAttachments) {
    attachments = []
    rawAttachments.forEach(({ file: { id, name, permalink } }) => attachments.push({ file: { id, name, permalink } }))
  }
  return attachments
}

export default {
  formatAttachments,
}
