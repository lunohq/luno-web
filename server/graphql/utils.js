import { offsetToCursor } from 'graphql-relay'

export function cursorForInstanceInCollection(instance, connection) {
  let cursor
  for (const index in connection) {
    const c = connection[index]
    if (c.id === instance.id) {
      cursor = offsetToCursor(index)
      break
    }
  }
  return { cursor, node: instance }
}
